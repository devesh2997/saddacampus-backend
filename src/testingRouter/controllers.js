var menu  = require("./../app/models/food/Menu");
var menuCategory = require("./../app/models/food/MenuCategory");
var menuCustomisation = require('./../app/models/food/MenuCustomization');

exports.menu = function(req,res){
    menu.create(req.body , function(err,result){
        if(err) res.send({error:err.message});
        else{
            res.send({result: result});
        }
    });
}

exports.getMenu = function(req,res){
    menu.findById(req.body , function(err,result){
        if(err) res.send({success:false , error:err.message});
        else{
            res.send({success: true , result: result});
        }
    })
}

exports.deleteMenu = function(req,res){
    menu.delete(req.body , function(err,result){
        if(err) res.send({success:false , error:err.message});
        else{
            res.send({success: true , result: result});
        }
        
    });
}

exports.menuCategory = function(req,res){
    menuCategory.create(req.body , function(err,result){
        if(err) res.send({error:err.message});
        else{
            res.send( result);
        }
    });
}

exports.menuCategoryUpdate = function(req,res){
    menuCategory.update(req.body , function(err,result){
        if(err) res.send({error:err.message});
        else{
            res.send(result);
        }
    });
}

exports.menuCategoryDelete = function(req,res){
    menuCategory.delete(req.body , function(err,result){
        if(err) res.send({error:err.message});
        else{
            res.send(result);
        }
    })
}

exports.getMenuCategory = function(req,res){
    menuCategory.findMenuCategory(req.body , function(err,result){
        if(err) res.send({error:err.message});
        else{
            res.send(result);
        }
    });
}

exports.menuCustomisation = function(req,res){
    menuCustomisation.create(req.body , function(err,result){
        if(err) res.send({error:err.message});
        else{
            res.send( result);
        }
    });
}

exports.getMenuCustomisation = function(req,res){
    menuCustomisation.findMenuCustomisation(req.body , function(err,result){
        if(err) res.send({error:err.message});
        else{
            res.send(result);
        }
    });
}

exports.menuCustomisationUpdate = function(req,res){
    menuCustomisation.update(req.body , function(err,result){
        if(err) res.send({error:err.message});
        else{
            res.send(result);
        }
    });
}

exports.menuCustomisationDelete = function(req,res){
    menuCustomisation.delete(req.body , function(err,result){
        if(err) res.send({error:err.message});
        else{
            res.send(result);
        }
    })
}