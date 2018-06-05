var async = require('async');
var Admin = require('../../../app/models/Admin');
var validator = require('../../../app/utility/validator');
var error_messages = require('../../../app/config/error_messages');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

/**
 * Admin authentication model
 * @param {Object} args
 * @param {String} args.username
 * @param {String} args.password
 */
var AdminAuth = function(args){
    //validate username
    this.usernameIsValid = function(next){
        if(validator.usernameIsValid(args.username))
            next(null, true);
        else
            next(new Error(error_messages.INVALID_USERNAME));
    }

    //validate password
    this.passwordIsValid = function(usernameIsValid,next){
        if(validator.passwordIsValid(args.password))
            next(null, true);
        else
            next(new Error(error_messages.INVALID_PASSWORD));
    }

    //retrive admin user from db
    this.retrieveAdminUser = function(passwordIsValid,next){
        Admin.findByUsername({username:args.username}, function(err, result){
            if(err)
                next(err);
            else if(result.Admin){
                next(null, result.Admin);
            }else
                next(new Error(error_messages.USER_DOES_NOT_EXIST));            
        });
    }

    //match password
    this.matchPassword = function(Admin, next){
        bcrypt.compare(args.password, Admin.encrypted_password, function(err, res) {
            if(!res)
                next(new Error(error_messages.WRONG_PASSWORD));
            else
                next(null,{
                    admin_id: Admin.admin_id,
                    username: Admin.username,
                    email: Admin.email,
                    role: Admin.role
                });
        });
    }

    //generate token
    this.generateToken = function(Admin, next){
        var admin_id_token = jwt.sign({
            admin_id: Admin.admin_id,
        },process.env.JWT_SECRET || 'mynameissaddacampus');

        next(null, {
            token:admin_id_token,
            Admin: Admin
        });
    }


    this.authenticate = function(next){
        async.waterfall([
            this.usernameIsValid,
            this.passwordIsValid,
            this.retrieveAdminUser,
            this.matchPassword,
            this.generateToken
        ], function(err, result){            
            var response = {}        
            if(err){
                response.success = false;
                response.message = err.message;
                next(null, response);
            }else{
                response.success = true;
                response.token = result.token;
                response.Admin = result.Admin;
                response.message = 'Successfully signed in';
                next(null, response);
            }
        });
    }
}

module.exports = AdminAuth;
