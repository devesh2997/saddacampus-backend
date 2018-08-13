var modal = require("./../modal/food/menu");
var Resource = require("./../Resource");
var uniqid = require("uniqid");
var error_messages = require('../../config/error_messages');

var Menu = function(resource){
    Resource.call(this,"Menus","menus",modal);
    this.resource = resource;
}
Menu.prototype  = Object.create(Resource.prototype);
Menu.prototype.constructor = Menu;

/**
 * Add a menu
 * @param {Object} args 
 * @param {String} args.description 
 */
Menu.prototype.addMenu = function(args,callback){
    var menu_id = uniqid();
    var currentTime = new Date().toLocaleString();
    var description = args.description || "";
    var values = {
        menu_id : menu_id,
        description : description,
        created_on : currentTime,
        updated_on : currentTime
    };
    this.resource.create(values , function(err,result){
            if(err) return callback(err);
            return callback(null,result);
    });
}
 
/**
 * Remove a menu 
 * @param {Object} args 
 * @param {String} args.menu_id 
 */
Menu.prototype.deleteMenu = function(args,callback){
    if(args.menu_id){
        this.resource.delete(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
		return callback(new Error(error_messages.MISSING_PARAMETERS));
	}
}

/**
 * Return the menu details for the given menu_id
 * @param {Object} args 
 * @param {String} args.menu_id 
 */
Menu.prototype.findByIdMenu = function(args,callback){
    if(args.menu_id){
        this.resource.get(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}


module.exports = new Menu(new Menu());