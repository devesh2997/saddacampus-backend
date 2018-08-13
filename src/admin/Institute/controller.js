var Institute = require('./../../app/models/Institute/Institue')

exports.addInstitue = function(req,res){
    Institute.addInstitute(req.body,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:false,result:result});
    })
}