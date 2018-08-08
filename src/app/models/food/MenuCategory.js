var error_messages = require('../../config/error_messages');
var Resource = require("./../Resource");
var menu_modal = require('./Menu');
var menu_category_modal = require('./../modal/menu_category');

var MenuCategory = function(menu_category){
    Resource.call(this,'MenuCategory','menu_categories',menu_category_modal);
    this.menu_category = menu_category;
    menu_category_modal.fields[1].ref_model = menu_modal.getRef();
    menu_category_modal.fields[1].ref_model_field_name = 'menu_id';
}
MenuCategory.prototype  = Object.create(Resource.prototype);
MenuCategory.prototype.constructor = MenuCategory;

/**
 * add categories to menu,
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {MenuCategory[]} args.categories
 */
MenuCategory.prototype.addCategories = function(args,callback){
    var flag = false;
    var error = {};
    var res = {};
    if(args.menu_id && args.categories && args.categories.length != 0){
            var categories = [...args.categories];
            categories.forEach(element => {
                var category_name = element.toUpperCase();
                var category_id = category_name.substr(0,3);
                var values = {
                    menu_id:args.menu_id,
                    category_id:category_id,
                    category_name:category_name
                }
                this.menu_category.create(values,function(err,result){
                    if(err) {
                        flag = true;
                        error[category_name] = err.message;
                    }
                    else {
                        res[category_name] = result.MenuCategory;
                    }
                    
                    if(categories[categories.length-1] == element)done();
                });
            });
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
 * Update category in a menu
 * returns {affectedRows}
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {String} args.category_id
 * @param {String} args.updated_category_name
 */
MenuCategory.prototype.updateCategory = function(args,callback){
    if(args.menu_id && args.category_id && args.updated_category_name){
        var args_where = {
            menu_id : args.menu_id,
            category_id : args.category_id
        };
        var updated_category_name = args.updated_category_name.toUpperCase();
        var updated_category_id = updated_category_name.substr(0,3);
        var args_set = {
            category_name : updated_category_name,
            category_id : updated_category_id
        };
        this.menu_category.update(args_set,args_where,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * find all nemu category with the provided menu id
 * return {Matched rows array}
 * @param {Object} args 
 * @param {String} args.menu_id 
 * @param {String} args.category_id
 */
MenuCategory.prototype.findMenuCategory = function(args,callback){
    var flag = true;
    var value = {};
    if(args.menu_id && args.category_id){
        value = {
            menu_id : args.menu_id,
            category_id : args.category_id
        };
    } 
    else if(args.menu_id){
        value = {
            menu_id : args.menu_id
        }
    }
    else if(args.category_id){
        value = {
            category_id : args.category_id
        }
    }
    else {
        flag = false;
    }
    if(flag){
        this.menu_category.get(value,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
    
}


/**
 * Delete category in a menu
 * returns {affectedRows}
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {String} args.category_id
 */
MenuCategory.prototype.deleteCategory = function(args,callback){
    if(args.menu_id && args.category_id){
        var value = {
            menu_id : args.menu_id,
            category_id : args.category_id
        }
        this.menu_category.delete(value,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

module.exports = new MenuCategory(new MenuCategory());