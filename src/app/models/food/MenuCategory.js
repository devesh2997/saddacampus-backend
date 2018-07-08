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
 * @returns {Object} {affectedRows:}
 */
exports.addCategories = function(args, callback){

	//check for duplicate category_id
	validateArgs(args,function(err){
		if(err)return callback(err);
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
						affectedRows: result.affectedRows
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
var validateArgs = function(args,callback){
	//check for missing parameters
	if(!args.menu_id || !args.hasOwnProperty('categories'))
		return callback(new Error(error_messages.MISSING_PARAMETERS));

	/**
	 * check for duplicates
	 */
	var categories = args.categories;
	var has = false;
	//check inside the given array
	for(var i=0 ;i<categories.length;i++){
		if(!validator.menuCategoryIdIsValid(categories[i].category_id))//validate category_id
			return callback(new Error(error_messages.INVALID_MENU_CATEGORY_ID));
		for(var j=i+1; j<categories.length; j++){
			if(categories[i].category_id === categories[j].category_id){
				has = true;
				break;
			}
		}
	}
	if(has)return callback(new Error(error_messages.DUPLICATE_MENU_CATEGORY));
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
		if(has)return callback(new Error(error_messages.DUPLICATE_MENU_CATEGORY));
		else return callback(null);
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
 * Deletes category from a menu
 * return {affectedRows:}
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {String} args.category_id
 */
exports.delete = function(args,callback){
	//check for missing parameters
	if(!args.menu_id || !args.category_id)
		return callback(new Error(error_messages.MISSING_PARAMETERS));

	if(!validator.menuCategoryIdIsValid(args.category_id))
		return callback(new Error(error_messages.INVALID_MENU_CATEGORY_ID));

	Menu.findById(args,function(err,result){
		if(err)return callback(err);
		if(!result.Menu)return callback(new Error(error_messages.MENU_DOES_NOT_EXIST));

		var query = QueryBuilder.delete().from([db.tables.menu_categories.name]).whereAllEqual({category_id:args.category_id}).build();
		db.get().query(query,function(err,result){
			if(err){
				Log.e(err.toString());
				return callback(new Error(error_messages.UNKNOWN_ERROR));
			}
			callback(null,{
				affectedRows: result.affectedRows
			});
		});
	});
}

/**
 * Update category in a menu
 * returns {affectedRows}
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {String} args.category_id
 * @param {Object} args.updated_category
 * @param {String} args.updated_category.category_id
 * @param {String} args.updated_category.category_name
 */
exports.update = function(args,callback){
	if(!args.menu_id || !args.category_id || !args.updated_category || !args.updated_category.category_id || !args.updated_category.category_name)
		return callback(new Error(error_messages.MISSING_PARAMETERS));

	if(!validator.menuCategoryIdIsValid(args.category_id) || !validator.menuCategoryIdIsValid(args.updated_category.category_id))
	return callback(new Error(error_messages.INVALID_MENU_CATEGORY_ID));

	//check for duplicates in the database
	getCategories(args,function(err,result){
		if(err)return callback(err);
		var databaseCategories = result.categories;
		for(var j=0; j<databaseCategories.length; j++){
			if(args.updated_category.category_id === databaseCategories[j].category_id){
				return callback(new Error(error_messages.DUPLICATE_MENU_CATEGORY));
			}
		}
		Menu.findById(args,function(err,result){
			if(err)return callback(err);
			if(!result.Menu)return callback(new Error(error_messages.MENU_DOES_NOT_EXIST));
			var query = QueryBuilder.update(db.tables.menu_categories.name).set(args.updated_category).whereAllEqual({category_id:args.category_id}).build();
			db.get().query(query,function(err,result){
				if(err){
					Log.e(err.toString());
					callback(new Error(error_messages.UNKNOWN_ERROR));
				}
				if(result.affectedRows !== 1)return callback(new Error(error_messages.UNKNOWN_ERROR));
				return callback(null, {
					affectedRows: result.affectedRows
				});
			});
		});
	});

}
