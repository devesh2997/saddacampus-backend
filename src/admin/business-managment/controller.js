var manager = require('./processes/manager');
var Business = require('./../../app/models/_Business');

exports.create = function(req,res){
	var requestBody = req.body;
	var args = {
		business_id: requestBody.business_id,
		merchant_id: requestBody.merchant_id,
		name: requestBody.name,
		address: requestBody.address,
		type: requestBody.type,
		gstin: requestBody.gstin || ''
	};
	var BusinessStart = new manager(args);
	BusinessStart.startBusiness(function(err, result){
		res.send(result);
	});
}

exports.get = function(req,res){
	Business.findBusiness({business_id: req.params.business_id},function(err,result){
		if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
	});
}

//enable Business with given Business_id
exports.enable = function(req, res){
	var args_old = {
		business_id : req.params.business_id,
		merchant_id : req.params.merchant_id
	};
	var args_update = {
		status : "active"
	}
	Business.updateBusiness({args_old:args_old , args_update : args_update},function(err,result){
		if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
	})
}

//disable Business with given Business_id
exports.disable = function(req, res){
	var args_old = {
		business_id : req.params.business_id,
		merchant_id : req.params.merchant_id
	};
	var args_update = {
		status : "disabled"
	}
	Business.updateBusiness({args_old:args_old , args_update : args_update},function(err,result){
		if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
	})
}

exports.delete = function(req,res){
	Business.deleteBusiness(req.body,function(err,result){
		if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
	})
}



