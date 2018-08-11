var error_messages = require('../../config/error_messages');
var menu = require('./Menu');
var menuCategory = require('./MenuCategory');
var menuCategoryItems = require('./MenuCategoryItems');
var async = require('async');
var ItemCustomisation = require('./Menu_category_items_has_customisations');
var MenuCustomisation = require('./MenuCustomizationOptions');
var CategoryCustomisation = require('./Menu_category_has_customisation');

var menu_result = [];

/**
 * @param {Object} args 
 * @param {String} args.menu_id
 * @param {String} args.category_id
 * @param {String} args.item_id
 */ 
var  findItemsCustomisation = function(args,callback){
    if(args && args.menu_id && args.category_id && args.item_id){
        ItemCustomisation.getItemCustomisation({menu_id:args.menu_id,category_id:args.category_id,item_id:args.item_id},function(err,result){
            if(err) return callback(err);
            var count = 0;
            var response = [];
            if(result.length!=0)
            {
                result.forEach(function(element){
                    MenuCustomisation.findCompleteOptions({menu_id:args.menu_id,customisation_id:element.customisation_id},function(err,res){
                        response[count++] = res[0];
                        if(count == result.length){
                            menu_result[0]["menuCategory"][args.count]["items"][args.item_count]["customisation"] = response;
                            return callback(null,{result:response,count:args.count,item_count:args.item_count});
                        }
                    });
                });
            } else {
                menu_result[0]["menuCategory"][args.count]["items"][args.item_count]["customisation"] = [];
                return callback(null,{result:[],count:args.count,item_count:args.item_count});
            }
            
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
} 

/**
 * Used to get the complete customisation for a particular Category
 * @param {Object} args 
 * @param {Number} args.resultCount
 * @param {String} args.category_id
 */                                  
var findCategoryCustomisation = function(args,callback){
    CategoryCustomisation.getCategoryCustomisation({menu_id:menu_result[0].menu_id,category_id:args.category_id},function(err,res){
        if(err) return callback(err);
        menu_result[0]["menuCategory"][args.resultCount]["customisations"] = res;
        callback(null)
    });
}


var GetCompleteMenu = function(){
    var getMenu = function(args,next){
        menu.findByIdMenu({menu_id:args.menu_id},function(err,result){
            if(err) return next(err);
            menu_result = result;
            return next(null);
        });
    }    
    var getCategories = function(next){
        if(menu_result.length == 0) return next(null);
        menuCategory.findMenuCategory({menu_id:menu_result[0].menu_id},function(err,res){
            if(err) return next(err);
            menu_result[0]["menuCategory"] = res;
            return next(null);
        })
    }
    var getItems = function(next){
        var count = 0;
        if(menu_result.length == 0 || menu_result[0]["menuCategory"].length == 0) return next(null);
        menu_result[0]["menuCategory"].forEach(function(element){
            menuCategoryItems.findCategoryItems({menu_id:menu_result[0].menu_id,category_id:element.category_id},function(err,res){
                if(err) return next(err);
                menu_result[0]["menuCategory"][count]["items"] = res;
                menu_result[0]["menuCategory"][count++]["customisations"] = [];
                if(count == menu_result[0]["menuCategory"].length) return next(null);
            });
        });
    }
    var getCustomisation = function(next){
        var count = 0;
        if( menu_result.length == 0 || menu_result[0]["menuCategory"].length == 0) return next(null);
        var resultCount = 0;
        menu_result[0]["menuCategory"].forEach(function(element){
            findCategoryCustomisation({category_id:element.category_id,resultCount:resultCount++},function(err){
                if(err) next(err)
                count++;
                if(count == menu_result[0]["menuCategory"].length) return next(null);
            });
        });
    }
    var getItemsCustomisation = function(next){
        var count = 0;
        var check = 0;
        var counterCheck = 0;
        if(menu_result.length == 0 || menu_result[0]["menuCategory"].length == 0) return next(null);
        menu_result[0]["menuCategory"].forEach(function(){
            var item_count = 0;
            if( menu_result[0]["menuCategory"][count]["items"].length != 0){
                menu_result[0]["menuCategory"][count]["items"].forEach(function(item){
                    check++;
                    findItemsCustomisation({menu_id:item.menu_id,category_id:item.category_id,item_id:item.item_id,count:count,item_count:item_count++},function(err){
                        if(err) return next(err);
                        counterCheck++;
                        if(counterCheck == check) return next(null);
                    });
                });
                count++;
            } else {
                count++;
            }
        });
    }
    this.getComplete = function(args,callback){
        if(args.menu_id){
            async.waterfall([
                async.apply(getMenu,args),
                getCategories,
                getItems,
                getCustomisation,
                getItemsCustomisation
            ] , function(err){
                if(err) return callback(err)
                return callback(null,menu_result);
            });
        } else {
            return callback(new Error(error_messages.MISSING_PARAMETERS));
        }
    }
}

module.exports = new GetCompleteMenu();

