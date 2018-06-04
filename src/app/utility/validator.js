var email_validator = require('email-validator');

exports.emailIsValid = function(email){
    return email_validator.validate(email);
}

exports.usernameIsValid = function(username){
    return username && username.length >= 5 && username.length <= 25;
}

exports.adminRoleIsValid = function(role){
    return role == 'super' || role == 'core' || role == 'support' || role == 'maintainer'
}