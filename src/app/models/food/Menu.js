var modal = require("./../modal/menu");
var Resource = require("./../Resource");
var uniqid = require("uniqid");
var error_messages = require('../../config/error_messages');
var menu = new Resource("Menus","menus",modal);

exports.create = function(args,callback){
    menu.getAll(function(err,result){
        if(err) return callback(err);
        var ids;
        if(result.length !=0)
            ids = result[result.length-1].id + 1;
        else 
            ids = 1;
        console.log(ids);
        var menu_id = uniqid();
        var currentTime = new Date().toLocaleString();
        var description = args.description || "";
        var values = {
            id: ids,
            menu_id : menu_id,
            description : description,
            created_on : currentTime,
            updated_on : currentTime
        };
        menu.create(values , function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    });
}

exports.delete = function(args,callback){
    if(args.menu_id){
        menu.delete(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
		return callback(new Error(error_messages.MISSING_PARAMETERS));
	}
}


exports.findById = function(args,callback){
    if(args.menu_id){
        menu.get({menu_id:args.menu_id},function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}