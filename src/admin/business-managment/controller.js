var manager = require('./processes/manager');

exports.create = function(req,res){
	var requestBody = req.body;
	var args = {
		merchant_id: requestBody.merchant_id,
		business_id: requestBody.business_id,
		name: requestBody.name,
		address: requestBody.address,
		type: requestBody.type,
		gstin: requestBody.gstin
	};
	var Business = new manager(args);
	Business.startBusiness(function(err, result){
		res.send(result);
	});
}



