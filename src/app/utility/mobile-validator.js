var error_messages = require('../config/error_messages');



/**
 * verifies country code and mobile number.
 * @param {Object} args 
 * @param {string} args.country_code
 * @param {string} args.number
 */

var NumberValidator = function(args){

    var mobileReg = /^[0-9]+$/;
    var countryCodeReg = /^[0-9-+]+$/;

    this.country_code = args.country_code;
    this.number = args.number;
    
    this.countryCodeIsValid = function(){
        return this.country_code && this.country_code.match(countryCodeReg);
    }

    this.numberIsValid = function(){
        return this.number && this.number.length == 10 && this.number.match(mobileReg);
    }

    this.isValid = function(){
        return this.countryCodeIsValid() && this.numberIsValid();
    }

    this.validationMessage = function(){
        if(!this.countryCodeIsValid()){
            return error_messages.INVALID_COUNTRY_CODE;
        }else if(!this.numberIsValid()){
            return error_messages.INVALID_MOBILE_NUMBER;
        }
    }

    
};


module.exports = NumberValidator;