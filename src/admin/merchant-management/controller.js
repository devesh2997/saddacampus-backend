var Onboarding = require('./processes/onboarding');
var Merchant = require('../../app/models/Merchant')

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

//enable merchant with given merchant_id
exports.enable = function(req, res){
	var merchantId = req.params.merchantId;
	Merchant.enable({merchant_id: merchantId}, function(err, result){
		var response = {};
		response.success = true;
		if(err){
			response.success = false;
			response.message = err.message;
		}else{
			var Merchant = {}
			Merchant.merchant_id = result.Merchant.merchant_id;
			Merchant.name = result.Merchant.name;
			Merchant.email = result.Merchant.email;
			Merchant.country_code = result.Merchant.country_code;
			Merchant.number = result.Merchant.number;
			Merchant.alternate_country_code = result.Merchant.alternate_country_code;
			Merchant.alternate_number = result.Merchant.alternate_number;
			Merchant.status = result.Merchant.status;
			response.Merchant = Merchant;
		}
		res.json(response);
	});
}

//disable merchant with given merchant_id
exports.disable = function(req, res){
	var merchantId = req.params.merchantId;
	Merchant.disable({merchant_id: merchantId}, function(err, result){
		var response = {};
		response.success = true;
		if(err){
			response.success = false;
			response.message = err.message;
		}else{
			var Merchant = {}
			Merchant.merchant_id = result.Merchant.merchant_id;
			Merchant.name = result.Merchant.name;
			Merchant.email = result.Merchant.email;
			Merchant.country_code = result.Merchant.country_code;
			Merchant.number = result.Merchant.number;
			Merchant.alternate_country_code = result.Merchant.alternate_country_code;
			Merchant.alternate_number = result.Merchant.alternate_number;
			Merchant.status = result.Merchant.status;
			response.Merchant = Merchant;
		}
		res.json(response);
	});
}
