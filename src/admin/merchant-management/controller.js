var Onboarding = require('./processes/onboarding');


// create new merchant
exports.create = function(req, res){
	var requestBody = req.body;
	var args = {
		name: requestBody.name,
		email: requestBody.email,
		password: requestBody.password,
		country_code: requestBody.country_code,
		number: requestBody.number,
		alternate_country_code: requestBody.alternate_country_code,
		alternate_number: requestBody.alternate_number
	};
	var MerchantOnboarding = new Onboarding(args);
	MerchantOnboarding.createMerchant(function(err, result){
		res.send(result);
	});
};
