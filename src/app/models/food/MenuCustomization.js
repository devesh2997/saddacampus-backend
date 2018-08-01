var error_messages = require('../../config/error_messages');
var Resource = require("./../Resource");
var menu_modal = require("./../modal/menu");
var menu_customisation_modal = require('./../modal/menu_customization');

var menu = new Resource("Menus","menus",menu_modal);
menu_customisation_modal.fields[1].ref_model = menu.getRef();
menu_customisation_modal.fields[1].ref_model_field_name = 'menu_id';
var menu_customisation = new Resource('MenuCustomisation','menu_customisations',menu_customisation_modal);

/**
 * create new Menu customisation row
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {MenuCustomisation[]} args.menu_customisation
 */
exports.create = function(args,callback){
    var flag = false;
    var error = {};
    var res = {};
    if(args && args.menu_id && args.menu_customisation && args.menu_customisation.length != 0){
        menu_customisation.getAll(function(err,result){
            if(err) return callback(err);
            var ids;
            if(result.length !=0)
                ids = result[result.length-1].id;
            else
                ids = 0;
            var customisation = [...args.menu_customisation];
            customisation.forEach(element => {
                ids++;
                var min_selections , max_selections ;
                var name = element.name.toUpperCase();
                var customisation_id = name.substr(0,3);
                if(!element.min_selections)
                    min_selections = 0;
                else
                    min_selections = element.min_selections;
                if(!element.max_selections)
                    max_selections = 0;
                else
                    max_selections = element.max_selections;
                if(min_selections > max_selections){
                    flag = true;
                    error[name] = error_messages.MIN_MAX_SELECTION;
                } else {
                    var values = {
                        id:ids,
                        menu_id:args.menu_id,
                        customisation_id: customisation_id,
                        name: name,
                        min_selections : min_selections,
                        max_selections : max_selections
                    }
                    menu_customisation.create(values,function(err,result){
                        if(err) {
                            flag = true;
                            error[name] = err.message;
                        }
                        else {
                            res[name] = result;
                        }
                        if(customisation[customisation.length-1] == element)done();
                    });
                }
                
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
exports.findMenuCustomisation = function(args,callback){
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
        menu_customisation.get(value,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
    
}
