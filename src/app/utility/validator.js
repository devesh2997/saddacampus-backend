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

exports.businessIdIsValid = function(business_id){
	return business_id && business_id.length == 3;
}

exports.menuCategoryIdIsValid = function(category_id){
	return category_id && category_id.length == 3;
}

exports.menuCustomisationIdIsValid = function(customisation_id){
	return customisation_id && customisation_id.length == 3;
}

exports.menuCategoryItemNameIsValid = function(item_name){
	return item_name && item_name.length >= 3;
}
