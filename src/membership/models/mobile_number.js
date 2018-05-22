var MobileValidator = require('../utility/mobile-validator');
var assert = require('assert');

/**
 * Model for mobile number
 * @param {Object} args
 * @param {string} args.country_code
 * @param {string} args.number
 */

var MobileNumber = function(args){

    this.country_code = args.country_code;
    this.number = args.number;

    this.isValid = function(){
        return new MobileValidator(args).isValid();
    };

    this.validationMessage = function(){
        return new MobileValidator(args).validationMessage();
    };
}

module.exports = MobileNumber;
