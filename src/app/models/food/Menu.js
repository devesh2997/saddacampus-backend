var db = require('../../lib/sadda-db');
var error_messages = require('../../config/error_messages');
var uniqid = require('uniqid');
var QueryBuilder = require('../../lib/db-utils').QueryBuilder;
var Log = require('../../lib/log');


/**
 * Create a new menu
 * @param {Object} args
 * @param {String} args.description
 */
exports.create = function(args, callback){
	var menu_id = uniqid();
	var currentTime = new Date().toLocaleString();
	var values = [menu_id,args.description,currentTime,currentTime];
	var query = QueryBuilder.insertInto(db.tables.menus.name).columns(db.tables.menus.fields).numOfValues(values.length).build();
	db.get().query(query,values, function(err){
		if(err){
			Log.e(err.toString());
			return callback(new Error(error_messages.UNKNOWN_ERROR));
		}else{
			findById({menu_id: menu_id},function(err, result){
				if(err)
					return callback(err);
				else{
					return callback(null,result);
				}
			});
		}
	});
}


/**
 * find menu by menu_id
 * @param {Object} args
 * @param {String} args.menu_id
 */
var findById = function(args, callback){
	if(!args.menu_id)
		return callback(new Error(error_messages.MISSING_PARAMETERS));
	var query = QueryBuilder.selectAll().from([db.tables.menus.name]).whereAllEqual({menu_id: args.menu_id}).build();
	db.get().query(query, function(err, result){
		if(err){
			Log.e(err.toString());
			return callback(new Error(error_messages.UNKNOWN_ERROR));
		}else{
			return callback(null, {
				Menu: result[0]
			});
		}
	});
}
exports.findById = findById;

