var State = require('./../../app/models/Institute/State')

exports.addState = function(req,res){
    State.addState(req.body,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:false,result:result});
    })
}