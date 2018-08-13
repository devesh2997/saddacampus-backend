var error_messages = require('../../config/error_messages');
var Resource = require("./../Resource");
var menu_modal = require('./Menu');
var menu_category_modal = require('./../modal/food/menu_category');
var _ = require('underscore');

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
 * @param {Object} args.categories[key]
 * @param {String} args.categories[key].category_id
 * @param {String} args.categories[key].category_name
 */
MenuCategory.prototype.addCategories = function(args,callback){
    var flag = false;
    var error = {};
    var res = {};
    if(args.menu_id && args.categories && args.categories.length != 0){
            var categories = [...args.categories];
            categories.forEach(element => {
                var value = element;
                value.menu_id = args.menu_id;
                this.menu_category.create(value,function(err,result){
                    if(err) {
                        flag = true;
                        error[element.category_name] = err.message;
                    }
                    else {
                        res[element.category_name] = result.MenuCategory;
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
 * @param {Object} args.args_old 
 * @param {Object} args.args_update
 */
MenuCategory.prototype.updateCategory = function(args,callback){
    if(args && !_.isEmpty(args.args_old) && !_.isEmpty(args.args_update)){
        this.menu_category.update(args.args_update,args.args_old,function(err,result){
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
    if(args && (args.menu_id || args.category_id)){
        this.menu_category.get(args,function(err,result){
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
    if(args && args.menu_id && args.category_id){
        this.menu_category.delete(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

module.exports = new MenuCategory(new MenuCategory());