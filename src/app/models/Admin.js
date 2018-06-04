var db = require('../lib/sadda-db');
var db_tables = db.tables;
var error_messages = require('../config/error_messages');
var db_utils = require('../lib/db-utils');
var uniqid = require('uniqid');
var Log = require('../lib/log');
var validator = require('../utility/validator');
var bcrypt = require('bcrypt');

//checking for duplicate entries
//check for duplicate username, email
var hasDuplicate = function(args, callback){
    var query = "SELECT * from " + db.tables.admins.name + " WHERE username = '"+args.username+"' OR email = '" + args.email + "'";
    db.get().query(query, function(err, result){
        if (err) {
            Log.e(err.toString());
            return callback(new Error(error_messages.UNKNOWN_ERROR));
        }
        if(result.length){
            return callback(null ,true);
        }
        else return callback(null, false);
    });
}


/**
 * Validate username, email, password and role 
 * @param {Object} args 
 * @param {String} args.username - Between 5 to 25 characters long
 * @param {String} args.email
 * @param {String} args.password - Atleast 6 characters long
 * @param {String} args.role - Can be super, core, support, maintainer
 */
var validateArgs = function(args, callback){
    //validate username
    //length of username should be > 5 and < 25
    if(!validator.usernameIsValid(args.username))
        callback(new Error(error_messages.INVALID_USERNAME));

    //validate email
    else if(!validator.emailIsValid(args.email))
        callback(new Error(error_messages.INVALID_EMAIL));
    
    //valdiate password
    else if(args.password.length < 6)
        callback(new Error(error_messages.INVALID_PASSWORD));

    //validate admin role
    else if(!validator.adminRoleIsValid(args.role))
        callback(new Error(error_messages.INVALID_ADMIN_ROLE));

    //check for duplicate user
    else{
        hasDuplicate(args,function(err, hasDuplicate){
            if(err)
                callback(err);
            else if(hasDuplicate)
                callback(new Error(error_messages.DUPLICATE_USER));
            else
                callback(null);
        });
    }   
}

/**
 * create a new admin
 * @param {Object} args 
 * @param {String} args.username - Between 5 to 25 characters long
 * @param {String} args.email
 * @param {String} args.password - Atleast 6 characters long
 * @param {String} args.role - Can be super, core, support, maintainer
 */
exports.create = function(args, callback){
    validateArgs(args, function(err){
        if(err)
            callback(err);
        else{
            var saltRounds = 10;
            args.admin_id =  uniqid(args.username.substr(0,4)); //create unique user_id
            bcrypt.hash(args.password, saltRounds, function(err, hash) { // generated encrypted_password to be stored in DB
                args.encrypted_password = hash;
                args.table_name = db_tables.admins.name;
                args.fields = db_tables.admins.fields;
                args.values = [args.admin_id, args.username, args.email, args.encrypted_password, args.role ];
                var query = db_utils.query_creator.insert(args);
                db.get().query(query, args.values, function(err){
                    if (err){
                        console.error(err.message);
                        
                        Log.e(err.toString());
                        callback(new Error(error_messages.UNKNOWN_ERROR));
                    }else{
                        callback(null, {
                            Admin: {
                                admin_id: args.admin_id,
                                username: args.username,
                                email: args.email,
                                role: args.role
                            }
                        });
                    }
                    
                });
            });
        }
    });
}

/**
 * find admin by username
 * @param {Object} args 
 * @param {String} args.username
 */
exports.findByUsername = function(args, callback){
    if(!validator.usernameIsValid(args.username)){
        callback(new Error(error_messages.INVALID_USERNAME));
    }else{
        var query = "SELECT * FROM "+db_tables.admins.name+" WHERE username = '"+args.username+"'";
        db.get().query(query, function(err,result){
            if(err){
                Log.e(err);
                callback(new Error(error_messages.UNKNOWN_ERROR));
            }else if(result[0]){
                callback(null, {
                    Admin: {
                        admin_id: result[0].admin_id,
                        username: result[0].username,
                        email: result[0].email,
                        role: result[0].role
                    }
                });
            }else{
                callback(null, {
                    Admin: result[0]
                });
            }
        });
    }
}

/**
 * find admin by admin_id
 * @param {Object} args 
 * @param {String} args.admin_id
 */
exports.findByAdminID = function(args, callback){
    if(!args.admin_id){
        callback(new Error(error_messages.MISSING_PARAMETERS));
    }else{
        var query = "SELECT * FROM "+db_tables.admins.name+" WHERE admin_id = '"+args.admin_id+"'";
        db.get().query(query, function(err,result){
            if(err){
                Log.e(err);
                callback(new Error(error_messages.UNKNOWN_ERROR));
            }else if(result[0]){
                callback(null, {
                    Admin: {
                        admin_id: result[0].admin_id,
                        username: result[0].username,
                        email: result[0].email,
                        role: result[0].role
                    }
                });
            }else{
                callback(null, {
                    Admin: result[0]
                });
            }
        });
    }
}