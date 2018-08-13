var error_messages = require('../../config/error_messages');
var Resource = require("./../Resource");
var menu_customisation_modal = require('./../modal/food/menu_customization');
var _ = require("underscore");
var menu_modal = require('./Menu');

var MenuCustomisation = function(menu_customisation){
    Resource.call(this,'MenuCustomisation','menu_customisations',menu_customisation_modal);
    this.menu_customisation = menu_customisation;
    menu_customisation_modal.fields[1].ref_model = menu_modal.getRef();
    menu_customisation_modal.fields[1].ref_model_field_name = 'menu_id';
}
MenuCustomisation.prototype  = Object.create(Resource.prototype);
MenuCustomisation.prototype.constructor = MenuCustomisation;

/**
 * create new Menu customisation row
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {MenuCustomisation[]} args.menu_customisation
 */
MenuCustomisation.prototype.addCustomisation = function(args,callback){
    var flag = false;
    var error = {};
    var res = {};
    if(args && args.menu_id && args.menu_customisation && args.menu_customisation.length != 0){
        var customisation = [...args.menu_customisation];
        customisation.forEach(element => {
            var values = {
                menu_id: args.menu_id,
                customisation_id: element.customisation_id,
                name: element.name,
                min_selections : element.min_selections || 0,
                max_selections : element.max_selections || 0
            }
            this.menu_customisation.create(values,function(err,result){
                if(err) {
                    flag = true;
                    error[element.name] = err.message;
                }
                else {
                    res[element.name] = result.MenuCustomisation;
                }
                if(customisation[customisation.length-1] == element)done();
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
 * 
 * @param {Object} args 
 * @param {String} args.menu_id
 * @param {String} args.customisation.id 
 */
MenuCustomisation.prototype.findMenuCustomisation = function(args,callback){
    if(args && args.menu_id && args.customisation_id){
        this.menu_customisation.get(args,function(err,result){
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
 * @param {Object} args.args_update 
 */
MenuCustomisation.prototype.updateCustomisation = function(args,callback){
    if(args && !_.isEmpty(args.args_old) && !_.isEmpty(args.args_update)){
        this.menu_customisation.update(args.args_update , args.args_old , function(err,result){
            if(err) return callback(err);
            return callback(null , result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }         
}
/**
 * delete from menu customisation
 * @param {Object} args 
 * @param {String} args.menu_id
 * @param {String} args.customisation_id 
 */
MenuCustomisation.prototype.deleteCustomisation = function(args,callback){
    if(args && (args.menu_id || args.customisation_id)){
        this.menu_customisation.delete(args , function(err,result){
            if(err) return callback(err);
            return  callback(null,result);
        });
    } else {
    return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

module.exports = new MenuCustomisation(new MenuCustomisation())