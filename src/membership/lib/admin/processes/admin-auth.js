var async = require('async');
var Admin = require('../../../../app/models/Admin');
var validator = require('../../../../app/utility/validator');
var error_messages = require('../../../../app/config/error_messages');

/**
 * Admin authentication model
 * @param {Object} args
 * @param {String} args.username
 * @param {String} args.password
 */
var AdminAuth = function(args){
    this.usernameIsValid = function(next){
        if(validator.usernameIsValid(args.username))
            next(null, true);
        else
            next(new Error(error_messages.INVALID_USERNAME));
    }

    this.passwordIsValid = function(next){
        if(validator.passwordIsValid(args.password))
            next(null, true);
        else
            next(new Error(error_messages.INVALID_PASSWORD));
    }

    this.authenticate = function(next){
        async.series({
            usernameIsValid: this.usernameIsValid,
            passwordIsValid: this.passwordIsValid
        }, function(err, result){            
            if(err){
                var response = {}
                response.success = false;
                response.message = err.message;
                next(null, response);
            }else{
                next(null, result.response);
            }
        })
    }
}

module.exports = AdminAuth;
