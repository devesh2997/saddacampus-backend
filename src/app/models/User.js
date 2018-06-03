var db = require('../lib/sadda-db');
var db_tables = db.tables;
var error_messages = require('../config/error_messages');
var db_utils = require('../lib/db-utils');
var uniqid = require('uniqid');
var Log = require('../lib/log');
var MobileNumber = require('../models/mobile_number');


//checking for duplicate entries
//check for duplicate country_code+number OR username
var hasDuplicate = function(args, callback){
    var query = "SELECT * from " + db.tables.users.name + " WHERE (country_code = '" + args.country_code + "' AND number = '" + args.number + "') OR username = '"+ args.username + "'";
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

//validate username
//length of username should be > 5 and < 25
var usernameIsValid = function(username){
    return username && username.length >= 5 && username.length <= 25;
}

/**
 * validates user before inserting in database
 * @param {Object} args
 * @param {String} args.country_code
 * @param {String} args.number
 * @param {String} args.username
 */
var userValidator = function(args, callback){
    if(!args.country_code || !args.number || !args.username )
        return callback(new Error(error_messages.MISSING_PARAMETERS));

    this.mobile = new MobileNumber({country_code: args.country_code, number: args.number});

    //validate username
    //length of username should be > 5 and < 25
    if(!usernameIsValid(args.username))
        callback(new Error(error_messages.INVALID_USERNAME));
  
    //validate mobile number
    else if(!this.mobile.isValid())
        callback(new Error(this.mobile.validationMessage()));

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
 * create user
 * @param {Object} args 
 * @param {String} args.country_code
 * @param {String} args.number
 * @param {String} args.username
 * @param {String} args.profilepic //TODO: to be implemented
 */
exports.create = function(args, callback){
    userValidator(args, function(err){
        if(err)
            callback(err);
        else{
            args.user_id =  uniqid(args.number.substr(0,4)); //create unique user_id
            args.status = 'verified';
            args.created_at = new Date().toLocaleString();
            args.table_name = db_tables.users.name;
            args.fields = db_tables.users.fields;
            args.values = [args.user_id, args.country_code, args.number, args.username, "", args.status, args.created_at ];
            var query = db_utils.query_creator.insert(args);  
            db.get().query(query, args.values, function(err){
                if (err){
                    Log.e(err.toString());
                    callback(new Error(error_messages.UNKNOWN_ERROR));
                }else{
                    callback(null, {
                        User: {
                            user_id: args.user_id,
                            username: args.username,
                            country_code: args.country_code,
                            number: args.number,
                            profilepic: args.profilepic,
                            status: args.status,
                            created_at: args.created_at
                        }
                    });
                }
                
            });
        }
    });
    
}

/**
 * find user by mobile
 * @param {Object} args 
 * @param {String} args.country_code
 * @param {String} args.number
 */
exports.findByMobile = function(args, callback){
    var mobile =  new MobileNumber({country_code: args.country_code, number: args.number});
    if(!mobile.isValid()){
        callback(new Error(mobile.validationMessage()));
    }else{
        var query = 'SELECT * FROM '+db_tables.users.name+' WHERE country_code = '+args.country_code+' AND number = '+args.number;
        db.get().query(query, function(err,result){
            if(err){
                Log.e(err);
                callback(new Error(error_messages.UNKNOWN_ERROR));
            }else{
                callback(null, {
                    User: result[0]
                });
            }
        });
    }
}

/**
 * find user by user_id
 * @param {Object} args 
 * @param {String} args.user_id
 */
exports.findByUserID = function(args, callback){
    if(!args.user_id){
        callback(new Error(error_messages.MISSING_PARAMETERS));
    }else{
        var query = "SELECT * FROM "+db_tables.users.name+" WHERE user_id = '"+args.user_id+"'";
        db.get().query(query, function(err,result){
            if(err){
                Log.e(err);
                callback(new Error(error_messages.UNKNOWN_ERROR));
            }else{
                callback(null, {
                    User: result[0]
                });
            }
        });
    }
}


