var uniqid = require('uniqid');
var MobileNumber = require('../../../models/mobile_number');
var error_messages = require('../../../config/error_messages');
var db = require('../../../../sadda-db');
var db_tables = db.tables;
var db_utils = require('../../../../db-utils');



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
    this.validateUsername = function(){
        return this.username && this.username.length > 5 && this.username.length < 25;
    }
    //validate mobile number
    this.validateMobileNumber = function(){
        return this.mobile.isValid();
    };

    this.isValid = function(){
        return this.validateUsername() && this.validateMobileNumber();
    }

    this.validationMessage = function(){
        if(!this.validateMobileNumber()){
            return this.mobile.validationMessage();
        }else if(!this.validateUsername()){
            return error_messages.INVALID_USERNAME;
        }
    }

    //generate unique user id.
    this.generateUserId = function(){
        context.user_id = uniqid(context.mobile.number.substr(0,4));
    }

    //store new user in database.
    this.store = function(callback){
        var args = {}
        args.table_name = db_tables.users.name;
        args.fields = db_tables.users.fields;
        args.values = [this.user_id, this.mobile.country_code, this.mobile.number, this.username, "", 'verified'];

        var query = db_utils.query_creator.insert(args);
  
        db.get().query(query, args.values, function(err, result){
            if (err) return callback(err);
            callback(null, result.insertId);
        });
    }    

    //checking for duplicate entries
    //check for duplicate user_id OR country_code+number OR username
    this.hasDuplicate = function(callback){
        var query = "SELECT * from " + db.tables.users.name + " WHERE user_id = '" + this.user_id + "' OR (country_code = '" + this.mobile.country_code + "' AND number = '" + this.mobile.number + "') OR username = '"+ this.username + "'";
        db.get().query(query, function(err, result){
            if (err) {
                return callback(err);
            }
            if(result.length) return callback(null,true);
            else return callback(null, false);
        });

    }
};

module.exports = User;