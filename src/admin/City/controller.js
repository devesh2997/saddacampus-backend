var State = require('./../../app/models/Institute/City')

exports.addCity = function(req,res){
    State.addCity(req.body,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:false,result:result});
    })
}