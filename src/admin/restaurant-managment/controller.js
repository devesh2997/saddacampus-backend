var Restaurant = require('./../../app/models/Restraunt_info');

exports.create = function(req,res){
    Restaurant.addRestaurant(req.body,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:false,result:result});
    });
}

exports.update = function(req,res){
    Restaurant.updateRestaurant(req.body,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
    })
}

exports.get = function(req,res){
    var value = {
        merchant_id : req.params.merchant_id,
        business_id : req.params.business_id,
        menu_id : req.params.menu_id
    }
    Restaurant.findRestaurant(value,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
    })
}

exports.delete = function(req,res){
    Restaurant.deleteRestaurant(req.body,function(err,result){
        if(err) res.send({success:false,error:err.message});
        else res.send({success:true,result:result});
    })
}