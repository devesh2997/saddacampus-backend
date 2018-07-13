var Merchant = require("./../../../app/models/Merchant")
var validator = require('./../../../app/utility/validator');
var error_messages = require("./../../../app/config/error_messages");
var jwt = require('jsonwebtoken');
var async = require('async');
var bcrpyt = require('bcrypt');

/**
 * Authentication model
 * @param {Object} args
 * @param {String} args.email
 * @param {String} args.password
 */
var Auth = function(args){
   
    //check for valid emal 
    this.validateEmail = function(next){
       if(!validator.emailIsValid(args.email))
            next(new Error(error_messages.INVALID_EMAIL));
        else 
            next(null , true);
    }

    //check for valid password
    this.validatePassword = function(next){
        if(!validator.passwordIsValid(args.password))
            next(new Error(error_messages.INVALID_PASSWORD));
        else
            next(null , true);
    }

    //check if merchant exist or not and send accordingly
    this.processAuthRequest = function(next){
        Merchant.findByEmail(args , function(err, result){
            if(err)
				next(err);
			else if(!result.Merchant){
               next(null, {
					success: true,
					merchant_exists: false
				});
			}else{
                var Merchant = result.Merchant;
                bcrpyt.compare(args.password ,Merchant.encrypted_password ,  function(err, res){
                    if(res) {
                        var merchant_id_token = jwt.sign({
                            merchant_id: Merchant.merchant_id
                        },process.env.JWT_SECRET || 'mynameissaddacampus');
                        next(null, {
                            success: true,
                            merchant_exists: true,
                            token: merchant_id_token,
                            Merchant : Merchant
                        });
                    } else {
                        next(new Error(error_messages.WRONG_PASSWORD));
                    }
                });
            }
        });
	}
	
	this.authenticate = function(next){
        async.series({
            emailIsValid : this.validateEmail,
            passwordIsValid : this.validatePassword,
            response : this.processAuthRequest
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

