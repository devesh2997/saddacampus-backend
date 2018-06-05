var db = require('../../../app/lib/sadda-db');
var validator = require('../../../app/utility/validator');
var User = require('../../../app/models/User');
var error_messages = require('../../../app/config/error_messages');

/**
 * checks if the given username is available or not
 * @param {String} username 
 */
exports.isUsernameAvailable = function(username, callback){
    if(validator.usernameIsValid(username)){
        User.findByUsername({
            username:username
        }, function(err, result){
            if(err)
                callback(err);
            else if (result.User){
                callback(null, false);
            }else{
                callback(null, true);
            }
        });
    }else{
        callback(new Error(error_messages.INVALID_USERNAME));
    }
}
