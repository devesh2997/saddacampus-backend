var db = require('../../lib/sadda-db');
var error_messages = require('../../config/error_messages');
var QueryBuilder = require('../../lib/db-utils').QueryBuilder;
var Log = require('../../lib/log');
var Menu = require('./Menu');
var validator = require('../../utility/validator');

//Customisation type def
/**
 * Menu customisation object.
 * @typedef {Object} MenuCustomisation
 * @property {String} customisation_id
 * @property {String} name
 * @property {number} min_selections
 * @property {number} max_selections
 */

/**
 * add customisations to menu,
 * returns affected rows
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {MenuCustomisation[]} args.customisations
 * @returns {Object} {noOfCustomisationsAdded:}
 */
exports.addCustomisations = function(args,callback){

	//validate args
	validateArgs(args,function(err){
		if(err)return callback(err);
		//check if menu exists or not
		Menu.findById(args,function(err, result){
			if(err)
				return callback(err);
			if(!result.Menu)
				return callback(new Error(error_messages.MENU_DOES_NOT_EXIST)); //return error if menu does not exist

			//add customisations if menu exists
			var values = []; //values to insert into table
			args.customisations.forEach(function(customisation){
				var value=[];
				value.push(args.menu_id);
				for(var key in customisation){
					value.push(customisation[key]);
				}
				values.push(value);
			});
			var query = QueryBuilder.insertInto(db.tables.menu_customisations.name).columns(db.tables.menu_customisations.fields).values().build();
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
 * validate arguments
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {Array} args.customisations
 */
var validateArgs = function(args,callback){
	//check for missing parameters
	if(!args.menu_id || !args.hasOwnProperty('customisations'))
		return callback(new Error(error_messages.MISSING_PARAMETERS));

	/**
	 * check for duplicates
	 */
	var customisations = args.customisations;
	var has = false;
	//check inside the given array
	for(var i=0 ;i<customisations.length;i++){
		if(!validator.menuCustomisationIdIsValid(customisations[i].customisation_id))//validate customisation_id
			return callback(new Error(error_messages.INVALID_MENU_CUSTOMISATION_ID));
		for(var j=i+1; j<customisations.length; j++){
			if(customisations[i].customisation_id === customisations[j].customisation_id){
				has = true;
				break;
			}
		}
	}
	if(has)return callback(new Error(error_messages.DUPLICATE_MENU_CUSTOMISATION));
	//check inside the database
	getCustomisations(args,function(err,result){
		if(err)return callback(err);
		var databaseCustomisations = result.customisations;
		for(var i=0 ;i<customisations.length;i++){
			for(var j=0; j<databaseCustomisations.length; j++){
				if(customisations[i].customisation_id === databaseCustomisations[j].customisation_id){
					has = true;
					break;
				}
			}
		}
		if(has)return callback(new Error(error_messages.DUPLICATE_MENU_CUSTOMISATION));
		else return callback(null);
	});

}

/**
 * Get categories in a menu
 * @param {Object} args
 * @param {String} args.menu_id
 * @returns {MenuCustomisation[]}
 */
var getCustomisations = function(args,callback){
	//check for missing parameters
	if(!args.menu_id)
		return callback(new Error(error_messages.MISSING_PARAMETERS));

	var query = QueryBuilder.selectAll().from([db.tables.menu_customisations.name]).whereAllEqual({menu_id:args.menu_id}).build();
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
			var customisations = [];
			for(var i=0;i<result.length;i++){
				customisations.push({
					customisation_id:result[i].customisation_id,
					name:result[i].name,
					min_selections:result[i].min_selections,
					max_selections:result[i].max_selections
				});
			}
			return callback(null,{customisations:customisations});
		});
	});
}
exports.getCustomisations = getCustomisations;

/**
 * Deletes customisation from a menu
 * return {affectedRows:}
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {String} args.customisation_id
 */
exports.delete = function(args,callback){
	//check for missing parameters
	if(!args.menu_id || !args.customisation_id)
		return callback(new Error(error_messages.MISSING_PARAMETERS));

	if(!validator.menuCustomisationIdIsValid(args.customisation_id))
		return callback(new Error(error_messages.INVALID_MENU_CUSTOMISATION_ID));

	Menu.findById(args,function(err,result){
		if(err)return callback(err);
		if(!result.Menu)return callback(new Error(error_messages.MENU_DOES_NOT_EXIST));

		var query = QueryBuilder.delete().from([db.tables.menu_customisations.name]).whereAllEqual({customisation_id:args.customisation_id}).build();
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
 * Update customisation in a menu
 * returns {affectedRows}
 * @param {Object} args
 * @param {String} args.menu_id
 * @param {String} args.customisation_id
 * @param {Object} args.updated_customisation
 * @param {String} args.updated_customisation.customisation_id
 * @param {String} args.updated_customisation.name
 * @param {String} args.updated_customisation.min_selections
 * @param {String} args.updated_customisation.max_selections
 */
exports.update = function(args,callback){
	if(!args.menu_id || !args.customisation_id || !args.updated_customisation || !args.updated_customisation.customisation_id || !args.updated_customisation.name)
		return callback(new Error(error_messages.MISSING_PARAMETERS));

	if(!validator.menuCustomisationIdIsValid(args.customisation_id) || !validator.menuCategoryIdIsValid(args.updated_customisation.customisation_id))
	return callback(new Error(error_messages.INVALID_MENU_CUSTOMISATION_ID));

	//check for duplicates in the database
	getCustomisations(args,function(err,result){
		if(err)return callback(err);
		var databaseCustomisations = result.customisations;
		for(var j=0; j<databaseCustomisations.length; j++){
			if(args.updated_customisation.customisation_id=== databaseCustomisations[j].customisation_id){
				return callback(new Error(error_messages.DUPLICATE_MENU_CUSTOMISATION));
			}
		}
		Menu.findById(args,function(err,result){
			if(err)return callback(err);
			if(!result.Menu)return callback(new Error(error_messages.MENU_DOES_NOT_EXIST));
			var query = QueryBuilder.update(db.tables.menu_customisations.name).set(args.updated_customisation).whereAllEqual({customisation_id:args.customisation_id}).build();
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
