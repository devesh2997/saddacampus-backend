var NewUser = require('../models/new_user');
var async = require('async');
var error_messages = require('../../../config/error_messages');



/**
 * Processes membership application (creates new user.)
 * @param {Object} args
 * @param {string} args.country_code
 * @param {string} args.number
 * @param {string} args.username 
 * @param {Object} args.profile_pic
 */

var Registration = function(args){

    var new_user = new NewUser(args);

    /**validate the arguments*/
    this.validateUserCredentials = function(next){
        if(new_user.isValid()){
            next(null, true);
        }else{
            next(new_user.validationMessage());
        }
    }

    //check for existing user_id, mobile or username -> return failure if mobile, username exists
    this.checkForDuplicateUsers = function(next){
        new_user.hasDuplicate(function(err, hasDuplicate){
            if(!err){
                if(hasDuplicate)
                    next(error_messages.DUPLICATE_USER,hasDuplicate);
                else
                    next(null, hasDuplicate);
            }
        });
    }

    //create uid
    this.createUserId = function(next){
        new_user.generateUserId(function(err, result){
            if(err)
                next(err);
            else if(result)
                next(null,new_user.user_id);
        });
    }

    //store user in database
    this.storeUser = function(next){
        new_user.store(function(err, result){
            if(err)
                next(err);
            else
                if(result)
                    next(null, true);
        });
    }

    this.finishRegistration = function(next){
        next(null,true);
    }


    this.processRegistration = function(next){
        async.series({
            validated: this.validateUserCredentials,
            hasDuplicate: this.checkForDuplicateUsers,
            user_id: this.createUserId,
            userStored: this.storeUser,
            success: this.finishRegistration
        }, function(err,result){
            if(err){
                result.success = false;
                result.message = err;
                next(null,result);
            }else{
                result.message = 'Registration successfull. Welcome to the Saddacampus experience.';
                next(null,result);
            }
        });
    }

};

module.exports = Registration;