var MobileNumber = require('../../../models/mobile_number');
var db = require('../../../../app/sadda-db');
var db_tables = db.db_tables;
var Log = require('../../../../app/log');
var error_messages = require('../../../config/error_messages');


/**
 * User authentication model
 * @param {Number} args.otp
 * @param {String} args.country_code
 * @param {String} args.number
 */

 var UserAuth = function(args){
    var mobile = new MobileNumber({country_code: args.country_code, number: args.number});
    var otp = args.otp;

    this.mobileIsValid = function(){
        return mobile.isValid();
    }

    
 }

 module.exports = UserAuth;