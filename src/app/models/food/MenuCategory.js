var db = require('../../lib/sadda-db');
var error_messages = require('../../config/error_messages');
var QueryBuilder = require('../../lib/db-utils').QueryBuilder;
var Log = require('../../lib/log');
var Menu = require('./Menu');
var validator = require('../../utility/validator');

//Category type
/**
 * Menu category object.
 * @typedef {Object} MenuCategory
 * @property {String} category_id
 * @property {String} category_name
 */

/**
 * add categories to menu,
 * returns affected rows
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {MenuCategory[]} args.categories
 * @returns {Object} {noOfCategoriesAdded:}
 */
exports.addCategories = function(args, callback){
	//check for missing parameters
	if(!args.menu_id || !args.hasOwnProperty('categories'))
		return callback(new Error(error_messages.MISSING_PARAMETERS));

	//check for duplicate category_id
	hasDuplicate(args,function(err,hasDuplicate){
		if(err)return callback(err);
		if(hasDuplicate)return callback(new Error(error_messages.DUPLICATE_MENU_CATEGORY));
		//check if menu exists or not
		Menu.findById(args,function(err, result){
			if(err)
				return callback(err);
			if(!result.Menu)
				return callback(new Error(error_messages.MENU_DOES_NOT_EXIST)); //return error if menu does not exist

			//add categories if menu exists
			var values = []; //values to insert into table
			args.categories.forEach(function(category){
				var value=[];
				value.push(args.menu_id);
				for(var key in category){
					value.push(category[key]);
				}
				values.push(value);
			});
			var query = QueryBuilder.insertInto(db.tables.menu_categories.name).columns(db.tables.menu_categories.fields).values().build();
			db.get().query(query,[values],function(err, result){
				if(err){
					Log.e(err.toString());
					return callback(new Error(error_messages.UNKNOWN_ERROR));
				}else{
					return callback(null, {
						noOfCategoriesAdded: result.affectedRows
					});
				}
			});
		});
	});
}

/**
 * Check to see if duplicate of given category_id list exists
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {Array} args.categories
 */
var hasDuplicate = function(args,callback){
	var has = false;
	var categories = args.categories;
	//check inside the given array
	for(var i=0 ;i<categories.length;i++){
		for(var j=i+1; j<categories.length; j++){
			if(categories[i].category_id === categories[j].category_id){
				has = true;
				break;
			}
		}
	}
	if(has)return callback(null,has);
	//check inside the database
	getCategories(args,function(err,result){
		if(err)return callback(err);
		var databaseCategories = result.categories;
		for(var i=0 ;i<categories.length;i++){
			for(var j=0; j<databaseCategories.length; j++){
				if(categories[i].category_id === databaseCategories[j].category_id){
					has = true;
					break;
				}
			}
		}
		return callback(null,has);
	});

}

/**
 * Get categories in a menu
 * @param {Object} args
 * @param {String} args.menu_id
 * @returns {MenuCategory[]}
 */
var getCategories = function(args,callback){
	//check for missing parameters
	if(!args.menu_id)
		return callback(new Error(error_messages.MISSING_PARAMETERS));

	var query = QueryBuilder.selectAll().from([db.tables.menu_categories.name]).whereAllEqual({menu_id:args.menu_id}).build();
	//check if menu exists or not
	Menu.findById(args,function(err,result){
		if(err)
			return callback(err);
		if(!result.Menu)
			return callback(new Error(error_messages.MENU_DOES_NOT_EXIST)); //return error if menu does not exist
		db.get().query(query,function(err,result){
			if(err){
				Log.e(err.toString());
				return callback(err);
			}
			var categories = [];
			for(var i=0;i<result.length;i++){
				categories.push({
					category_id:result[i].category_id,
					category_name:result[i].category_name
				});
			}
			return callback(null,{categories:categories});
		});
	});
}
exports.getCategories = getCategories;

/**
 *
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {String} args.category_id
 */
exports.delete = function(args,callback){
	//check for missing parameters
	if(!args.menu_id || !args.category_id)
		return callback(new Error(error_messages.MISSING_PARAMETERS));
}
