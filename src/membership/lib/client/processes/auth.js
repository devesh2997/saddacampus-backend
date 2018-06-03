var db = require('../../../../app/lib/sadda-db');
var otp = require('../../../../app/lib/otp');
var db_utils = require('../../../../app/lib/db-utils');
var MOBILE_NUMBER = require('../../../../app/models/mobile_number');
var async = require('async');

/**
 * Authentication model
 * @param {Object} args
 * @param {String} args.country_code
 * @param {String} args.number
 * @param {String} args.otp 
 */
var Auth = function(args){
    
    //verify mobile number
    var mobile = new MOBILE_NUMBER({country_code: args.country_code, number: args.number});
    this.mobileIsValid = function(next){
        if(mobile.isValid())
            next(null, true);
        else
            next(mobile.validationMessage());
    }

    //validate OTP
    this.validateOTP = function(next){
        var VerifyOTP = otp.verifyOTP(args);
        VerifyOTP.verify(function(err, result){
            if(result.success)
                next(null,true);
            else{
                next(result.message);
            }
        });
    }

    this.finishAuthentication = function(next){
        next(null,true);
    }

    this.authenticate = function(next){
        async.series({
            mobileIsValid: this.mobileIsValid,
            validateOTP: this.validateOTP,
            success: this.finishAuthentication
        }, function(err){
            var response = {}
            if(err){
                response.success = false;
                response.message = err;
                next(null, response);
            }else{
                response.message = 'You have been successfully logged in.';
                next(null, response);
            }
        });
    }
}

module.exports = Auth;

