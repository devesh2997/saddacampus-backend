var error_messages = require('../config/error_messages');
var QueryBuilder = require('../lib/db-utils').QueryBuilder;
var db = require('../lib/sadda-db');
var Log = require('../lib/log');

//Resource field type def
/**
 * Resource field object.
 * @typedef {Object} Field
 * @property {String} name
 * @property {Object} type
 * @property {boolean} isPrimary
 * @property {boolean} isForeign
 * @property {Object} ref_model
 * @property {String} ref_model_field_name
 * @property {function} validator
 * @property {String} validation_error
 * @property {boolean} isCompulsory
 */

/**
 * Resource model
 * @param {String} table_name
 * @param {Field[]} fields
 */
var Resource = function(resource_name,table_name,fields){
	this.resource_name = resource_name;
	this.table_name = table_name;
	this.fields = fields;
}

Resource.prototype.getFieldByName = function(field_name){
	var req_field = null;
	this.fields.forEach(field => {
		if(field.name === field_name)
			req_field = field;
	});
	return req_field;
}

Resource.prototype.checkForField = function(field_name){
	var flag = false;
	this.fields.forEach(field => {
		if(field.name === field_name)
			flag = true;
	});
	return flag;
}

/**
 * validate field values
 * @param {{field_name: field_value}[]} values
 */
Resource.prototype.validateValues = function(values){
	var flag = true;
	values.forEach(field => {
		for(var field_name in field){
			if(!this.checkForField(field_name)){
				flag = false;
				field.err = error_messages.INVALID_RESOURCE_FIELD;
				continue;
			}
			var resc_field = this.getFieldByName(field_name);
			if(typeof field[field_name] !== resc_field.type){
				flag = false;
				field.err = resc_field.validation_error;
				continue;
			}
			if(resc_field.validator){
				if(!resc_field.validator(field[field_name])){
					flag = false;
					field.err = resc_field.validation_error;
					continue;
				}
			}
		}
	});
	return {
		allCorrect: flag,
		values: values
	}
}

/**
 * Find row by primary keys
 * @param {{field_name:field_value}} args key-value pairs of primary keys
 */
Resource.prototype.findByPrimaryKey = function(args, callback){
	var res_name = this.resource_name;
	for(var field_name in args){
		var model_field = this.getFieldByName(field_name);
		if(model_field && !model_field.isPrimary){
			delete args[field_name];
		}
	}
	for(var field in this.fields){
		if(field.isPrimary){
			if(!args[field.name])
				return callback(new Error(error_messages.MISSING_PRIMARY_KEY +':'+field_name));
		}
	}
	this.get(args,function(err,result){
		if(err) return callback(err);
		var res = {};
		res[res_name] = result[0];
		return callback(null,res);
	});
}

Resource.prototype.validateForeignConstraints = function(args,callback){
	var flag = true;
	for(var field in this.fields){
		if(!field.isForeign)
			continue;
		(function(field){
			field.ref_model.findByPrimaryKey(args,function(err,result){
				if(err) return callback(err);
				if(!result[field.res_name]) return callback(new Error(error_messages.FOREIGN_KEY_CONSTRAINT_FAILED + field.toString()));
			});
		}(field));
	}
}

/**
 * Get resource
 * @param {{field_name:field_value}} args
 */
Resource.prototype.get = function(args, callback){
	var query = QueryBuilder.selectAll().from([this.table_name]).whereAllEqual(args).build();
	db.get().query(query,function(err,result){
		if(err){
			Log.e(err.toString());
			return callback(new Error(error_messages.UNKNOWN_ERROR));
		}
		result.forEach(row => {
			for(var field_name in row){
				var model_field = this.getFieldByName(field_name);
				if(model_field.type === 'password')
					delete row[field_name];
			}
		});
		return callback(null,result)
	});
}

/**
 * Create resource
 * @param {{field_name:field_value}} args
 */
Resource.prototype.create = function(args,callback){
	var res_name = this.resource_name;
	var columns =[], values=[];
	for(var field in args){
		columns.push(field);
		values.push(args[field]);
	}
	var query = QueryBuilder.insertInto(this.table_name).columns(columns).numOfValues(values.length).build();
	db.get().query(query,values,function(err){
		if(err){
			Log.e(err.toString());
			return callback(new Error(error_messages.UNKNOWN_ERROR));
		}
		this.get(args,function(err,result){
			if(err)return callback(err);
			var res = {};
			res[res_name] = result[0];
			return callback(null,res);
		});
	});
}

module.exports = Resource;
