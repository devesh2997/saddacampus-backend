var db = require('../lib/sadda-db');
var db_tables = db.tables;
var error_messages = require('../config/error_messages');
var db_utils = require('../lib/db-utils');
var uniqid = require('uniqid');
var Log = require('../lib/log');
var validator = require('../utility/validator');




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
    else if(validator.adminRoleIsValid(args.role))
        callback(new Error(error_messages.INVALID_ADMIN_ROLE));
    
    else
        callback(null);
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
            args.user_id =  uniqid(args.username.substr(0,4)); //create unique user_id
            
        }
    });
}