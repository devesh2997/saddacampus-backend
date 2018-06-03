var uniqid = require('uniqid');
var MobileNumber = require('../../../../app/models/mobile_number');
var error_messages = require('../../../../app/config/error_messages');
var db = require('../../../../app/lib/sadda-db');
var db_tables = db.tables;
var db_utils = require('../../../../app/lib/db-utils');
var Log = require('../../../../app/lib/log');



/**
 * New User model for registration
 * @param {Object} args
 * @param {string} args.country_code
 * @param {string} args.number
 * @param {string} args.username 
 * @param {Object} args.profile_pic
 */

var User = function(args){
    var context = this;
    this.mobile = new MobileNumber({country_code: args.country_code, number: args.number});
    this.username = args.username;

    //validate username
    //length of username should be > 5 and < 25
    this.usernameIsValid = function(){
        return this.username && this.username.length > 5 && this.username.length < 25;
    }
    //validate mobile number
    this.mobileIsValid = function(){
        return this.mobile.isValid();
    };

    this.isValid = function(){
        return this.usernameIsValid() && this.mobileIsValid();
    }

    this.validationMessage = function(){
        if(!this.mobileIsValid()){
            return this.mobile.validationMessage();
        }else if(!this.usernameIsValid()){
            return error_messages.INVALID_USERNAME;
        }
    }

    //generate unique user id.
    this.generateUserId = function(callback){
        context.user_id = uniqid(context.mobile.number.substr(0,4));
        if(context.user_id)
            callback(null, true);
        else
            callback(new Error(error_messages.UNKNOWN_ERROR));
    }

    //store new user in database.
    this.store = function(callback){
        var args = {}
        args.table_name = db_tables.users.name;
        args.fields = db_tables.users.fields;
        args.values = [this.user_id, this.mobile.country_code, this.mobile.number, this.username, "", 'verified', new Date().toLocaleString()];
        var query = db_utils.query_creator.insert(args);  
        db.get().query(query, args.values, function(err, result){
            if (err){
                Log.e(err.toString());
                return callback(new Error(error_messages.UNKNOWN_ERROR));
            } 
            callback(null, result.insertId);
        });
    }    

    //checking for duplicate entries
    //check for duplicate user_id OR country_code+number OR username
    this.hasDuplicate = function(callback){
        var query = "SELECT * from " + db.tables.users.name + " WHERE user_id = '" + this.user_id + "' OR (country_code = '" + this.mobile.country_code + "' AND number = '" + this.mobile.number + "') OR username = '"+ this.username + "'";
        db.get().query(query, function(err, result){
            if (err) {
                Log.e(err.toString());
                return callback(new Error(error_messages.UNKNOWN_ERROR));
            }
            if(result.length){
                context.error_message = error_messages.DUPLICATE_USER;
                return callback(null,true);
            }
            else return callback(null, false);
        });
    }
};

module.exports = User;