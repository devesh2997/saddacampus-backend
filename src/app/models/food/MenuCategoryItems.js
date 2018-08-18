var error_messages = require('../../config/error_messages');
var Resource = require("./../Resource");
var menu_modal = require('./Menu');
var menu_category_modal = require('./MenuCategory');
var menu_category_items_modal = require('./../modal/food/menu_category_items');
var _ = require("underscore");

var MenuCategoryItems = function(){
    Resource.call(this,'MenuCategoryItems','menu_category_items',menu_category_items_modal);
    menu_category_items_modal.fields[1].ref_model = menu_modal.getRef();
    menu_category_items_modal.fields[1].ref_model_field_name = 'menu_id';
    menu_category_items_modal.fields[2].ref_model = menu_category_modal.getRef();
    menu_category_items_modal.fields[2].ref_model_field_name = 'category_id';
}
MenuCategoryItems.prototype  = Object.create(Resource.prototype);
MenuCategoryItems.prototype.constructor = MenuCategoryItems;

/**
 * add categories to menu,
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {String} args.category_id
 * @param {MenuCategoryItems[]} args.category_items
 */
MenuCategoryItems.prototype.addCategoryItems = function(args,callback){
    var flag = false;
    var error = {};
    var res = {};
    var scope = this;
    if(args && args.menu_id && args.category_id && args.category_items.length != 0){
            var items = [...args.category_items];
            this.get({menu_id:args.menu_id , category_id:args.category_id},function(err,result){
                if(err) return callback(err);
                var item_id = result.length==0?1:result[result.length-1].item_id;
                items.forEach(element => {
                    item_id++;
                    var values = {
                        menu_id:args.menu_id,
                        category_id: args.category_id,
                        item_id : item_id,
                        name: element.name.toUpperCase(),
                        price : element.price,
                        description : element.description || "",
                        availability : element.availability || false,
                        image : "",
                        cuisine : "",
                        is_non_veg : element.is_non_veg || false
                    }
                    scope.create(values,function(err,result){
                        if(err) {
                            flag = true;
                            error[element.name] = err.message;
                        }
                        else {
                            res[element.name] = result.MenuCategoryItems;
                        }
                        if(items[items.length-1] == element)done();
                    })
                });
            })
         
        } else{
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
    function done(){
        if(flag){
            return callback(null,{succes:false , error: error , result : res});
        }else{
           return callback(null,{success:true,result:res});
        }
    }
}

/**
 * find a particular item or a list of item 
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {String} args.category_id
 * @param {String} args.item_id
 */
MenuCategoryItems.prototype.findCategoryItems = function(args,callback){
    if(!_.isEmpty(args)){
        this.get(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * 
 * @param {Object} args 
 * @param {Object} args.args_old
 * @param {String} args.args_old.menu_id
 * @param {String} args.args_old.category_id
 * @param {String} args.args_old.item_id
 * @param {Object} args.args_updates 
 */
MenuCategoryItems.prototype.updateCategoryItem = function(args,callback){
    if(args && !(_.isEmpty(args.args_old)) && !(_.isEmpty(args.args_updates))){
        this.update(args.args_updates , args.args_old , function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * Delete a item from the category item table
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {String} args.category_id
 * @param {String} args.item_id
 */
MenuCategoryItems.prototype.deleteCategoryItem = function(args,callback){
    if(args && args.menu_id && args.category_id && args.item_id){
        this.delete({menu_id:args.menu_id,category_id:args.category_id,item_id:args.item_id},function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        })
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}


module.exports = new MenuCategoryItems();