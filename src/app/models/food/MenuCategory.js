var error_messages = require('../../config/error_messages');
var Resource = require("./../Resource");
var menu_modal = require("./../modal/menu");
var menu_category_modal = require('./../modal/menu_category');

var menu = new Resource("Menus","menus",menu_modal);
menu_category_modal.fields[1].ref_model = menu.getRef();
menu_category_modal.fields[1].ref_model_field_name = 'menu_id';
var menu_category = new Resource('MenuCategory','menu_categories',menu_category_modal);

/**
 * add categories to menu,
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {MenuCategory[]} args.categories
 */
exports.create = function(args,callback){
    var flag = false;
    var error = {};
    var res = {};
    if(args.menu_id && args.categories && args.categories.length != 0){
        menu_category.getAll(function(err,result){
            if(err) return callback(err);
            var ids;
            if(result.length !=0)
                ids = result[result.length-1].id;
            else
                ids = 0;
            var categories = [...args.categories];
            categories.forEach(element => {
                ids++;
                var category_name = element.toUpperCase();
                var category_id = category_name.substr(0,3);
                var values = {
                    id:ids,
                    menu_id:args.menu_id,
                    category_id:category_id,
                    category_name:category_name
                }
                menu_category.create(values,function(err,result){
                    if(err) {
                        flag = true;
                        error[category_name] = err.message;
                    }
                    else {
                        res[category_name] = result;
                    }
                    
                    if(categories[categories.length-1] == element)done();
                });
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
exports.update = function(args,callback){
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
        menu_category.update(args_set,args_where,function(err,result){
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
exports.findMenuCategory = function(args,callback){
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
        menu_category.get(value,function(err,result){
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
exports.delete = function(args,callback){
    if(args.menu_id && args.category_id){
        var value = {
            menu_id : args.menu_id,
            category_id : args.category_id
        }
        menu_category.delete(value,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}