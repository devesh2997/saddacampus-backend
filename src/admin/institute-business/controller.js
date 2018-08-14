var Institute_business = require('./../../app/models/Institute/Institute_has_business');

exports.create = function(req,res){
    Institute_business.addInstitute(req.body,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
    })
}

exports.update = function(req,res){
    Institute_business.updateInstitute(req.body,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
    });
}

exports.get = function(req,res){
    var value = {
        code : req.params.code
    };
    Institute_business.findInstitute(value,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
    })
}

exports.delete = function(req,res){
    Institute_business.deleteInstitute(req.body,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
    });
}