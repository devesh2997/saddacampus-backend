var OTP = require('../models/OTP-verify');
var MOBILE_NUMBER = require('../../../models/mobile_number');
var async = require('async');


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
        otp.verify(function(err, result){
            if(err)
                next(err);
            else{
                next(null,result);
            }
        })
    }

    //

    this.finishVerifying = function(next){
        next(null,true);
    }

    this.verify = function(next){
        async.series({
            mobile_validated: this.verifyNumber,
            otp_verified: this.verifyOTP,
            success: this.finishVerifying
        },function(err,result){
            if(err){
                result.success = false;
                result.message = err;
                next(null,result);
            }else{
                if(result.otp_verified)
                    result.message = 'OTP successfully verified.';
                else
                    result.message = 'Incorrect OTP provided.'
                next(null,result);
            }
        });
    }
}


module.exports = verifyOTP;