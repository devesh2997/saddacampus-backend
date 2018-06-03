var otp = require('../../../../app/lib/otp');
var MOBILE_NUMBER = require('../../../../app/models/mobile_number');
var async = require('async');
var User = require('../../../../app/models/User');
var jwt = require('jsonwebtoken');

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
            next(new Error(mobile.validationMessage()));
    }

    //validate OTP
    this.validateOTP = function(next){
        var VerifyOTP = otp.verifyOTP(args);
        VerifyOTP.verify(function(err, result){
            if(result.success)
                next(null,true);
            else{
                next(new Error(result.message));
            }
        });
    }

    //check if user exists or not and process accordingly
    this.processAuthRequest = function(next){
        User.findByMobile(args, function(err, result){
            if(err)
                next(err);
            else if(!result.User){
                // generate jwt token with mobile number
                var mobile_token = jwt.sign({
                    country_code: args.country_code,
                    number: args.number
                },'12345');

                next(null, {
                    success: true,
                    user_exists: false,
                    token: mobile_token
                });
            }else{
                var User = result.User;
                //generate jwt token with user_id
                var user_id_token = jwt.sign({
                    user_id: User.user_id
                },'12345');

                next(null, {
                    success: true,
                    user_exists: true,
                    token: user_id_token,
                    User: User
                });
            }
        });
    }


    this.authenticate = function(next){
        async.series({
            mobileIsValid: this.mobileIsValid,
            validateOTP: this.validateOTP,
            response: this.processAuthRequest
        }, function(err, result){            
            if(err){
                var response = {}
                response.success = false;
                response.message = err.message;
                next(null, response);
            }else{
                next(null, result.response);
            }
        });
    }
}

module.exports = Auth;

