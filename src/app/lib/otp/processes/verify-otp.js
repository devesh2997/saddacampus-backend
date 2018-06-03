var OTP = require('../models/OTP-verify');
var MOBILE_NUMBER = require('../../../models/mobile_number');
var async = require('async');
var error_messages = require('../../../../app/config/error_messages');


/**
 * verify otp sent to a given mobile number
 * @param {Object} args
 * @param {String} args.country_code
 * @param {String} args.number
 * @param {String} args.otp
 */
var verifyOTP = function(args){
    var otp = new OTP(args);

    //verify mobile number
    var mobile = new MOBILE_NUMBER({country_code: args.country_code, number: args.number});
    this.verifyNumber = function(next){
        if(mobile.isValid())
            next(null, true);
        else
            next(mobile.validationMessage());
    }

    //retrieve otp
    this.retrieveOTP = function(next){
        otp.retrieveOTP(function(err,result){
            if(err)
                next(err);
            else{
                next(null,result);
            }
        });
    }

    //verify otp
    this.verifyOTP = function(next){
        if(otp.verify()){
            next(null,true);
        }else{
            next(error_messages.INCORRECT_OTP);
        }
    }

    //

    this.finishVerifying = function(next){
        next(null,true);
    }

    this.verify = function(next){
        async.series({
            mobile_validated: this.verifyNumber,
            retrive_otp: this.retrieveOTP,
            otp_verified: this.verifyOTP,
            success: this.finishVerifying
        },function(err){
            var response = {}
            if(err){
                response.success = false;
                response.message = err;
                next(null,response);
            }else{
                response.success = true;
                next(null,response);
            }
        });
    }
}


module.exports = verifyOTP;