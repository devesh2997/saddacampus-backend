var modal = require("./../modal/menu");
var Resource = require("./../Resource");
var uniqid = require("uniqid");
var error_messages = require('../../config/error_messages');

var Menu = function(resource){
    Resource.call(this,"Menus","menus",modal);
    this.resource = resource;
}
Menu.prototype  = Object.create(Resource.prototype);
Menu.prototype.constructor = Menu;

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
 
Menu.prototype.deleteMenu = function(args,callback){
    if(args.menu_id){
        this.resource.delete({menu_id : args.menu_id},function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
		return callback(new Error(error_messages.MISSING_PARAMETERS));
	}
}


Menu.prototype.findByIdMenu = function(args,callback){
    if(args.menu_id){
        this.resource.get({menu_id:args.menu_id},function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}


module.exports = new Menu(new Menu());