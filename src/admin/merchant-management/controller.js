var Onboarding = require('./processes/onboarding');
var Merchant = require('../../app/models/_Merchants')

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

exports.get = function(req,res){
	Merchant.findMerchant({merchant_id: req.params.merchant_id},function(err,result){
		if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
	});
}

//enable merchant with given merchant_id
exports.enable = function(req, res){
	var args_old = {
		merchant_id : req.params.merchant_id
	};
	var args_update = {
		status : "active"
	}
	Merchant.updateMerchant({args_old:args_old , args_update : args_update},function(err,result){
		if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
	})
}

//disable merchant with given merchant_id
exports.disable = function(req, res){
	var args_old = {
		merchant_id : req.params.merchant_id
	};
	var args_update = {
		status : "disabled"
	}
	Merchant.updateMerchant({args_old:args_old , args_update : args_update},function(err,result){
		if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
	})
}

exports.delete = function(req,res){
	Merchant.deleteMerchant(req.body,function(err,result){
		if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
	})
}