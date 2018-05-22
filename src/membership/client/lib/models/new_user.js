var MobileNumber = require('../../../models/mobile_number');
var error_messages = require('../../../config/error_messages');


/**
 * New User model for registration
 * @param {Object} args
 * @param {string} args.country_code
 * @param {string} args.number
 * @param {string} args.username 
 * @param {Object} args.profile_pic
 */

var User = function(args){
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

    
};

module.exports = User;