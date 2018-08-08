var menu  = require("./../app/models/food/Menu");
var menuCategory = require("./../app/models/food/MenuCategory");
var menuCustomisation = require('./../app/models/food/MenuCustomization');
var menuCategoryItems = require('./../app/models/food/MenuCategoryItems');
var menuCustomisationOptions = require('./../app/models/food/MenuCustomizationOptions');
var getMenu = require('./../app/models/food/getMenu');
var itemCustomisation  = require('./../app/models/food/Menu_category_items_has_customisations');
exports.menu = function(req,res){ 
   // console.log(menu.getRef());
    menu.addMenu(req.body , function(err,result){
        if(err) res.send({error:err.message});
        else{
            res.send({result: result});
        }
    });
}

exports.getMenu = function(req,res){
    menu.findByIdMenu(req.body , function(err,result){
        if(err) res.send({success:false , error:err.message});
        else{
            res.send({success: true , result: result});
        }
    })
}

exports.deleteMenu = function(req,res){
    menu.deleteMenu(req.body , function(err,result){
        if(err) res.send({success:false , error:err.message});
        else{
            res.send({success: true , result: result});
        }
        
    });
}

exports.menuCategory = function(req,res){
    menuCategory.addCategories(req.body , function(err,result){
        if(err) res.send({error:err.message});
        else{
            res.send( result);
        }
    });
}

exports.menuCategoryUpdate = function(req,res){
    menuCategory.updateCategory(req.body , function(err,result){
        if(err) res.send({error:err.message});
        else{
            res.send(result);
        }
    });
}

exports.menuCategoryDelete = function(req,res){
    menuCategory.deleteCategory(req.body , function(err,result){
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
    menuCustomisation.addCustomisation(req.body , function(err,result){
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
    menuCustomisation.updateCustomisation(req.body , function(err,result){
        if(err) res.send({error:err.message});
        else{
            res.send(result);
        }
    });
}

exports.menuCustomisationDelete = function(req,res){
    menuCustomisation.deleteCustomisation(req.body , function(err,result){
        if(err) res.send({error:err.message});
        else{
            res.send(result);
        }
    })
}

exports.categoryItems = function(req,res){
    menuCategoryItems.addCategoryItems(req.body , function(err,result){
        if(err) res.send({error:err.message});
        else{
            res.send( result);
        }
    });
}

exports.findMenuCategoryItem = function(req,res){
    menuCategoryItems.findItemsCustomisation(req.body , function(err,result){
        if(err) res.send({error: err.message});
        else{
            res.send(result);
        }
    });
}

exports.updateMenuCategoryItem = function(req,res){
    menuCategoryItems.updateCategoryItem(req.body , function(err,result){
        if(err) res.send({error: err.message});
        else{
            res.send(result);
        }
    });
}

exports.deleteMenuCategoryItem = function(req,res){
    menuCategoryItems.deleteCategoryItem(req.body , function(err,result){
        if(err) res.send({error: err.message});
        else{
            res.send(result);
        }
    });
}

exports.customisationOptions = function(req,res){
    menuCustomisationOptions.addCustomisationOptions(req.body , function(err,result){
        if(err) res.send({error:err.message});
        else{
            res.send( result);
        }
    });
}

exports.findMenuCustomisationOptions = function(req,res){
    menuCustomisationOptions.findCustomisationOptions(req.body , function(err,result){
        if(err) res.send({error: err.message});
        else{
            res.send(result);
        }
    });
}

exports.updateMenuCustomisationOption = function(req,res){
    menuCustomisationOptions.updateCustomisationOption(req.body , function(err,result){
        if(err) res.send({error: err.message});
        else{
            res.send(result);
        }
    });
}

exports.deleteMenuCustomisationOption = function(req,res){
    menuCustomisationOptions.deleteCustomisationOption(req.body , function(err,result){
        if(err) res.send({error: err.message});
        else{
            res.send(result);
        }
    });
}

exports.completeMenu = function(req,res){
    var value = {menu_id : req.params.menu_id};
    getMenu.getComplete(req.body,function(err,result){
        if(err) res.send({error:err.message});
        else{
            res.send(result);
        }
    })
}

exports.itemCustomisation = function(req,res){
    itemCustomisation.addItemCustomisation(req.body , function(err,result){
        if(err) res.send({error:err.message});
        else{
            res.send(result);
        }
    })
}