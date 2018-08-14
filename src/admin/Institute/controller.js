var Institute = require('./../../app/models/Institute/Institue')
var Institute_business = require('./../../app/models/Institute/Institute_has_business');

exports.create = function(req,res){
    Institute.addInstitute(req.body,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
    })
}

exports.update = function(req,res){
    Institute.updateInstitute(req.body,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
    })
}

exports.get = function(req,res){
    var value = {
        code: req.params.code
    };
    Institute.findInstitute(value,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
    })
}

exports.delete = function(req,res){
    Institute.deleteInstitute(req.body,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
    })
}

exports.createInstituteBusiness = function(req,res){
    Institute_business.addInstitute(req.body,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
    })
}