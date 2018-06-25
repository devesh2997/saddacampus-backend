var email_validator = require('email-validator');

exports.nameIsValid = function(name){
	return name && name.length >= 5 && name.length <= 100;
}

exports.emailIsValid = function(email){
    return email && email_validator.validate(email);
}

exports.usernameIsValid = function(username){
    return username && username.length >= 5 && username.length <= 25;
}

exports.adminRoleIsValid = function(role){
    return role && (role == 'super' || role == 'core' || role == 'support' || role == 'maintainer');
}

exports.passwordIsValid = function(password){
    return password && password.length > 5;
}
