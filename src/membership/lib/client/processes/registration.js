var async = require('async');
var User = require('../../../../app/models/User');
var jwt = require('jsonwebtoken');

/**
 * Processes membership application (creates new user.)
 * @param {Object} args
 * @param {string} args.country_code
 * @param {string} args.number
 * @param {string} args.username 
 * @param {Object} args.profile_pic
 */

var Registration = function(args){

    var user;

    //create user
    this.createUser = function(next){
        User.create(args,function(err, result){
            if(err)
                next(err);
            else{
                user = result.User;
                next(null,result.User);
            } 
        });
    }
    //generate jwt token with user_id
    this.createToken = function(next){
        var user_id_token = jwt.sign({
            user_id: user.user_id
        },process.env.JWT_SECRET || 'mynameissaddacampus');
        next(null, user_id_token);
    }

    this.finishRegistration = function(next){
        next(null,true);
    }


    this.register = function(next){
        async.series({
            User: this.createUser,
            token: this.createToken,
            success: this.finishRegistration
        }, function(err,result){
            if(err){
                var response = {};
                response.success = false;
                response.message = err.message;
                next(null,response);
            }else{
                result.message = 'Registration successfull. Welcome to the Saddacampus experience.';
                next(null,result);
            }
        });
    }

};

module.exports = Registration;