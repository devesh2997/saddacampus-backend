var sms = require('../sms-sender');
var OTP = require('./models/OTP');
var MOBILE_NUMBER = require('../../models/mobile_number');
var error_messages = require('../../config/error_messages');
var async = require('async');


/**
 * send otp to the given mobile number
 * @param {Object} args
 * @param {String} args.country_code
 * @param {String} args.number
 * @param {function} callback
 */
exports.sendOTP = function(args){
    var otp = new OTP(args);

    //verify mobile number
    var mobile = new MOBILE_NUMBER({country_code: args.country_code, number: args.number});
    this.verifyNumber = function(next){
        if(mobile.isValid())
            next(null, true);
        else
            next(mobile.validationMessage());
    }

    //generate otp    
    this.generateOTP = function(next){
        otp.generate(function(err, result){
            if(err)
                next(err);
            else{
                if(result)
                    next(null,result);
                else
                    next(new Error(error_messages.UNKNOWN_ERROR));
            }
        });
    }

    //delete current otp from database
    this.deleteOTP = function(next){
        otp.deleteOTP(function(err, result){
            if(err)
                next(err);
            else{
                if(result)
                    next(null,result);
                else
                    next(new Error(error_messages.UNKNOWN_ERROR));
            }
        });
    }

    //insert new otp in database
    this.insertOTP = function(next){
        otp.insertOTP(function(err, result){
            if(err)
                next(err);
            else{
                if(result)
                    next(null,result);
                else
                    next(new Error(error_messages.UNKNOWN_ERROR));
            }
        });
    }

    //generate otp message
    this.generateMessage = function(next){
        otp.generateMessage(function(err, result){
            if(err)
                next(err);
            else{
                if(result)
                    next(null,result);
                else
                    next(new Error(error_messages.UNKNOWN_ERROR));
            }
        });
    }

    //send otp message
    this.sendMessage = function(next){
        sms.send({country_code:args.country_code, number: args.number, message:otp.message}, function(err, result){
            if(err)
                next(err);
            else
                next(null,result);
        });
    }

    this.finishSending = function(next){
        next(null, true);
    }

    this.send = function(next){
        async.series([
            this.verifyNumber,
            this.generateOTP,
            this.deleteOTP,
            this.insertOTP,
            this.generateMessage,
            this.sendMessage,
            this.finishSending
        ], function(err, result){
            if(err){
                result.success = false;
                result.message = err;
                next(null, result);
            }else{
                result.success = true;
                result.message = 'OTP has been sent to '+args.country_code+args.number+', valid for 10 minutes.';
                next(null,result);
            }
        });
    }    

}