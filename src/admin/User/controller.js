var User_info = require('./../../app/models/User_info');
var UserData = require('./processes/UserData');

exports.create = function(req,res){
    User_info.addUser(req.body,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
    });
}

exports.get = function(req,res){
    var Data = new UserData({user_id : req.params.user_id});
    Data.getAll(function(result){
        res.send(result);
    });
}

exports.update = function(req,res){
    User_info.updateUser(req.body,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
    });
}

exports.delete = function(req,res){
    User_info.deleteUser(req.body,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
    });
}