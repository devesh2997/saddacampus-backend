var error_messages = require('../../config/error_messages');
var Resource = require("./../Resource");
var menu_modal = require('./Menu');
var menu_customisation_modal = require('./MenuCustomization');
var menu_customisation_options_modal = require('./../modal/food/menu_customization_options');
var _ = require("underscore");

var MenuCustomisationOptions = function(menu_customisation_options){
    Resource.call(this,'MenuCustomisationOptions','menu_customisation_options',menu_customisation_options_modal);
    this.menu_customisation_options = menu_customisation_options;
    menu_customisation_options_modal.fields[1].ref_model = menu_modal.getRef();
    menu_customisation_options_modal.fields[1].ref_model_field_name = 'menu_id';
    menu_customisation_options_modal.fields[2].ref_model = menu_customisation_modal.getRef();
    menu_customisation_options_modal.fields[2].ref_model_field_name = 'customisation_id';
}
MenuCustomisationOptions.prototype  = Object.create(Resource.prototype);
MenuCustomisationOptions.prototype.constructor = MenuCustomisationOptions;

/**
 * add categories to menu,
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {String} args.customisation_id
 * @param {MenuCustomisationOptions[]} args.customisation_options
 */
MenuCustomisationOptions.prototype.addCustomisationOptions = function(args,callback){
    var flag = false;
    var error = {};
    var res = {};
    var scope = this;
    if(args && args.menu_id && args.customisation_id && args.customisation_options && args.customisation_options.length != 0){
            var items = [...args.customisation_options];
            this.menu_customisation_options.get({menu_id:args.menu_id , customisation_id:args.customisation_id},function(err,result){
                if(err) return callback(err);
                var item_id = result.length==0?0:result[result.length-1].customisation_option_id;
                items.forEach(element => {
                    item_id++;
                    var values = {
                        menu_id:args.menu_id,
                        customisation_id: args.customisation_id,
                        customisation_option_id : item_id,
                        name: element.name.toUpperCase(),
                        price : element.price,
                        is_non_veg : element.is_non_veg || false
                    }
                    scope.menu_customisation_options.create(values,function(err,result){
                        if(err) {
                            flag = true;
                            error[element.name] = err.message;
                        }
                        else {
                            res[element.name] = result.MenuCustomisationOptions;
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
 * @param {String} args.customisation_id
 * @param {String} args.customisation_option_id
 */
MenuCustomisationOptions.prototype.findCustomisationOptions = function(args,callback){
    if(!_.isEmpty(args)){
        this.menu_customisation_options.get(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * return the customisation along with its options 
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {String} args.customisation_id
 */
MenuCustomisationOptions.prototype.findCompleteOptions = function(args,callback){
    var scope = this;
    if(args && args.menu_id && args.customisation_id){
        menu_customisation_modal.findMenuCustomisation({menu_id:args.menu_id,customisation_id:args.customisation_id},function(err,result){
            if(err) return callback(err);
            var count = 0;
            if(result.length!=0){
                result.forEach(function(){
                    scope.menu_customisation_options.get({menu_id:args.menu_id,customisation_id:args.customisation_id},function(err,res){
                        if(err) return callback(err);
                        result[count++]["custumisationOption"] = res;
                        if(count == result.length) return callback(null,result);
                    });
                });
            } else {
                return callback(null,result);
            }
        });
    } else {
        return callback(error_messages.MISSING_PARAMETERS);
    }
}
/**
 * 
 * @param {Object} args 
 * @param {Object} args.args_old
 * @param {String} args_old.menu_id
 * @param {String} args_old.customisation_id
 * @param {String} args_old.customisation_option_id
 * @param {Object} args.args_update 
 */
MenuCustomisationOptions.prototype.updateCustomisationOption = function(args,callback){
    if(args && args.menu_id && args.customisation_id && args.customisation_option_id && !(_.isEmpty(args.updates))){
        var args_where = {
            menu_id : args.menu_id,
            customisation_id : args.customisation_id,
            customisation_option_id : args.customisation_option_id
        };
        this.menu_customisation_options.update(args.updates , args_where , function(err,result){
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
 * @param {String} args.customisation_id
 * @param {String} args.customisation_option_id
 */
MenuCustomisationOptions.prototype.deleteCustomisationOption = function(args,callback){
    if(args && args.menu_id && args.customisation_id && args.customisation_option_id){
        this.menu_customisation_options.delete({menu_id:args.menu_id,customisation_id:args.customisation_id,customisation_option_id:args.customisation_option_id},function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        })
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

module.exports = new MenuCustomisationOptions(new MenuCustomisationOptions());