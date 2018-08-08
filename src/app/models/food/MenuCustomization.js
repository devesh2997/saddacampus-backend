var error_messages = require('../../config/error_messages');
var Resource = require("./../Resource");
var menu_customisation_modal = require('./../modal/menu_customization');
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
            var min_selections , max_selections ;
            var name = element.name.toUpperCase();
            var customisation_id = name.substr(0,3);
            min_selections = element.min_selections ? element.min_selections : 0;
            max_selections = element.max_selections ? element.max_selections : 0;
            if(min_selections > max_selections){
                flag = true;
                error[name] = error_messages.MIN_MAX_SELECTION;
            } else {
                var values = {
                    menu_id:args.menu_id,
                    customisation_id: customisation_id,
                    name: name,
                    min_selections : min_selections,
                    max_selections : max_selections
                }
                this.menu_customisation.create(values,function(err,result){
                    if(err) {
                        flag = true;
                        error[name] = err.message;
                    }
                    else {
                        res[name] = result.MenuCustomisation;
                    }
                    if(customisation[customisation.length-1] == element)done();
                });
            }
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
    var flag = true;
    var value = {};
    if(args.menu_id && args.customisation_id){
        value = {
            menu_id : args.menu_id,
            customisation_id : args.customisation_id
        };
    } 
    else if(args.menu_id){
        value = {
            menu_id : args.menu_id
        }
    }
    else if(args.customisation_id){
        value = {
            customisation_id : args.customisation_id
        }
    }
    else {
        flag = false;
    }
    if(flag){
        this.menu_customisation.get(value,function(err,result){
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
 * @param {String} args.menu_id
 * @param {String} args.customisation_id
 * @param {Object} args.update 
 */
MenuCustomisation.prototype.updateCustomisation = function(args,callback){
    var args_where;
    if(args && args.menu_id && args.customisation_id && args.update && !(_.isEmpty(args.update))){
        args_where = {
            menu_id : args.menu_id,
            customisation_id : args.customisation_id
        }
    }
    else if(args && args.customisation_id && args.update && !(_.isEmpty(args.update))){
        args_where = {
            customisation_id : args.customisation_id
        }
    }
    else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
    if(args.update.name != null){
        args.update.name  = args.update.name.toUpperCase();
        args.update["customisation_id"] = args.update.name.substr(0,3);
    }
    this.menu_customisation.update(args.update , args_where , function(err,result){
        if(err) return callback(err);
        return callback(null , result);
    });
} 

/**
 * delete from menu customisation
 * @param {Object} args 
 * @param {String} args.menu_id
 * @param {String} args.customisation_id 
 */
MenuCustomisation.prototype.deleteCustomisation = function(args,callback){
    var value;
    if(args && args.menu_id && args.customisation_id){
        value = {
            menu_id : args.menu_id,
            customisation_id : args.customisation_id
        }
    }
    else if(args && args.menu_id){
        value = {
            menu_id : args.menu_id
        }
    }
    else if(args && args.customisation_id){
        value = {
            customisation_id : args.customisation_id
        }
    }
    else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
    this.menu_customisation.delete(value , function(err,result){
        if(err) return callback(err);
        return  callback(null,result);
    });
}

module.exports = new MenuCustomisation(new MenuCustomisation());