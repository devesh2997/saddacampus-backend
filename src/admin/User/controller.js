var User_info = require('./../../app/models/User_info');

exports.addUserInfo = function(req,res){
    User_info.addUser(req.body,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
    });
}

exports.getUserInfo = function(req,res){
    User_info.getUserInfo({user_id:req.params.user_id},function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
    });
}