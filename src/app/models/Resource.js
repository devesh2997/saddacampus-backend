var error_messages = require('../config/error_messages');
var QueryBuilder = require('../lib/db-utils').QueryBuilder;
var db = require('../lib/sadda-db');
var Log = require('../lib/log');
var async = require('async');

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
 * @param {String} resource_name
 * @param {String} table_name
 * @param {Object} def
 */
var Resource = function(resource_name,table_name,def){
	this.resource_name = resource_name;
	this.table_name = table_name;
	this.fields = def.fields;
	this.indexes = def.indexes;
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
 * @param {{field_name: field_value}} values
 */
Resource.prototype.validateValues = function(values,callback){
	var flag = true;
	var errors = {};
	for(var field_name in values){
		if(!this.checkForField(field_name)){
			flag = false;
			errors[field_name] = error_messages.INVALID_RESOURCE_FIELD;
			continue;
		}
		var resc_field = this.getFieldByName(field_name);
		if(typeof values[field_name] !== resc_field.type){
			flag = false;
			if(resc_field.validation_error)errors[field_name] = resc_field.validation_error;
			else errors[field_name] = error_messages.INVALID_RESOURCE_FIELD_TYPE
			continue;
		}
		if(resc_field.validator){
			if(!resc_field.validator(values[field_name])){
				flag = false;
				errors[field_name] = resc_field.validation_error;
				continue;
			}
		}
	}
	if(!flag){
		return callback(new Error(JSON.stringify(errors)));
	}else{
		return callback(null);
	}
}

/**
 * Find row by primary keys
 * @param {{field_name:field_value}} args key-value pairs of primary keys
 */
Resource.prototype.findByPrimaryKey = function(args, callback){
	var res_name = this.resource_name;
	var primary_args = {};
	for(var field_name in args){
		var model_field = this.getFieldByName(field_name);
		if(model_field && model_field.isPrimary){
			primary_args[field_name]= args[field_name];
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

Resource.prototype.hasDuplicate = function(args, callback){
	var res_name = this.resource_name;
	this.findByPrimaryKey(args, function(err,result){
		if(err){
			return callback(err);
		}
		if(result[res_name]){
			return callback(new Error(error_messages.DUPLICATE_RESOURCE));
		}
		return callback(null);
	});
}

Resource.prototype.hasUpdationDuplicate = function(args_old,args_new, callback){
	var res_name = this.resource_name;
	var flag = true;
	var count = 0;
	var error;
	for(var field_name in args_old){
		var field = this.getFieldByName(field_name);
		if(args_old[field_name] !== args_new[field_name] && field.isPrimary){
			this.findByPrimaryKey(args_new, function(err,result){
				count++;
				flag = false;
				if(err){
					error = err;
				}else if(result[res_name]){
					error = new Error(error_messages.DUPLICATE_RESOURCE);
				}
				if(count == Object.keys(args_old).length)done();
			});
		}else{
			count++;
			if(count == Object.keys(args_old).length)done();
		}
	}
	function done(){
		if(error)return callback(error);
		return callback(null);
	}
}

Resource.prototype.validateForeignConstraints = function(args,callback){
	var error = null;
	var foreign_field = [];
	this.fields.forEach(field => {
		if(field.isForeign)
			foreign_field.push(field);
	});
	var count =0 ;
	if(foreign_field.length === 0)done();
	foreign_field.forEach(field => {
		if(args[field.name]) {
			var foreign_arg = {};
			foreign_arg[field.name] = args[field.name];
			field.ref_model.get(foreign_arg,function(err,result){
				count ++;
				if(err) error = err;
				else if(!result[0]) error = new Error(error_messages.FOREIGN_KEY_CONSTRAINT_FAILED + field.toString());
				if(count === foreign_field.length)done();
			});
		}else{
			count++;
			if(count === foreign_field.length)done();
		}

	});
	function done(){
		if(error)return callback(error);
		return callback(null);
	}
}

Resource.prototype.validateUniqueConstraints = function(args,callback){
	var error = {};
	var flag = false;
	if(!this.indexes.unique || this.indexes.unique.length === 0) done();
	var count = 0;
	var unique_indexes = this.indexes.unique;
	unique_indexes.forEach(unique_index => {
		count++;
		var unique_fields = unique_index.fields;
		var unique_args = {};
		unique_fields.forEach(field => {
			if(!args[field]){
				flag = true;
				error[unique_index.name] = new Error(error_messages.UNIQUE_FIELD_MISSING);
			}else unique_args[field] = args[field];
		});
		if(!error[unique_index.name]){
			this.get(unique_args,function(err,result){
				if(err) return callback(err);
				if(result.length !== 0){
					flag = true;
					error[unique_index.name] = unique_index.duplication_error;
				}
				if(count === unique_indexes.length)done();
			});
		}else{
			if(count === unique_indexes.length)done();
		}
	});
	function done(){
		if(flag)return callback(new Error(JSON.stringify(error)));
		return callback(null);
	}
}


/**
 * Get resource
 * @param {{field_name:field_value}} args
 */
Resource.prototype.get = function(args, callback){
	var scope = this;
	var query = QueryBuilder.selectAll().from([this.table_name]).whereAllEqual(args).build();
	db.get().query(query,function(err,result){
		if(err){
			Log.e(err.toString());
			return callback(new Error(error_messages.UNKNOWN_ERROR));
		}
		result.forEach(row => {
			for(var field_name in row){
				if(field_name != "id"){
					var model_field = scope.getFieldByName(field_name);
					if(model_field.type === 'password')
						delete row[field_name];
				}
			}
		});
		return callback(null,result)
	});
}

/**
 * Create resource
 * @param {{field_name:field_value}} args
 */
Resource.prototype.insert = function(args,callback){
	var scope = this;
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
		scope.get(args,function(err,result){
			if(err)return callback(err);
			var res = {};
			res[res_name] = result[0];
			return callback(null,res);
		});
	});
}

Resource.prototype.create = function(args,callback){
	async.series([
		this.validateValues.bind(this,args),
		this.validateForeignConstraints.bind(this,args),
		this.hasDuplicate.bind(this,args),
		this.insert.bind(this,args)
	], function(err, result){
		if(err){
			return callback(err);
		}else{
			return callback(null, result[3]);
		}
	});
}

Resource.prototype.updateRow = function(args_set,args_where,callback){
	var args_where_primary = {};
	for(var field_name in args_where){
		var field = this.getFieldByName(field_name);	
		if(field.isPrimary){
			args_where_primary[field_name] = args_where[field_name];
		}
	}
	var query = QueryBuilder.update(this.table_name).set(args_set).whereAllEqual(args_where_primary).build();
	db.get().query(query,function(err,result){
		if(err){
			Log.e(err.message);
			return callback(new Error(error_messages.UNKNOWN_ERROR));
		}
		if(result.affectedRows ===  0)return callback(new Error(error_messages.UNKNOWN_ERROR));
		return callback(null);
	});
}

Resource.prototype.updateFieldForeignConstraintsNotAllowed = function(args,callback){
	for(var field_name in args){
		var field = this.getFieldByName(field_name);
		if(field.isForeign){
			return callback(new Error(error_messages.FOREIGN_KEY_UPDATE_NOT_ALLOWED));
		}
	}
	return callback(null);
}
Resource.prototype.processUpdate = function(args_set,args_where,callback){
	var response = [];
	var scope = this;
	var count = 0;
	this.get(args_where, function(err,result){
		if(err)return callback(err);
		if(result.length === 0)done();
		result.forEach(row => {
			var new_row = {};
			
			for(var field_name in row)
				new_row[field_name] = row[field_name];
			for(var field in args_set){
				new_row[field] = args_set[field];
			}
			async.series({
				updateFieldForeignConstraintsNotAllowed:scope.updateFieldForeignConstraintsNotAllowed.bind(scope,args_set),
				hasUpdationDuplicate:scope.hasUpdationDuplicate.bind(scope,row,new_row),
				updateRow:scope.updateRow.bind(scope,args_set,row),
				result:scope.get.bind(scope,new_row)
			}, function(err, res){
				count++;
				if(err){
					return callback(err);
				}else{
					response.push(res['result'][0]);
				}
				if(count === result.length)done();
			});
		});
	});
	function done(){
		return callback(null,response);
	}
}


Resource.prototype.update = function(args_set,args_where,callback){
	async.series([
		this.validateValues.bind(this,args_set),
		this.validateValues.bind(this,args_where),
		this.processUpdate.bind(this,args_set,args_where)
	], function(err,result){
		if(err)return callback(err);
		return callback(null,result[2]);
	});
}

Resource.prototype.deleteRowExist = function(args_where,callback){
	this.get(args_where,function(err,result){
		if(err)return callback(err);
		if(result.length === 0){
			return callback(new Error(error_messages.MENU_DOES_NOT_EXIST));
		}else{
			return callback(null);
		}
	});
}

Resource.prototype.deleteRows = function(args_where,callback){
	var query = QueryBuilder.delete().from([this.table_name]).whereAllEqual(args_where).build();
	db.get().query(query,function(err,result){
		if(err){
			Log.e(err.message);
			return callback(new Error(error_messages.UNKNOWN_ERROR));
		}
		return callback(null,result);
	});
} 

Resource.prototype.delete = function(args,callback){
	async.series([
		this.validateValues.bind(this,args),
		this.deleteRowExist.bind(this,args),
		this.deleteRows.bind(this,args)
	], function(err,result){
			if(err)return callback(err);
			return callback(null,result[2]);
		});
}

Resource.prototype.getRef = function(){
	return this;
}
module.exports = Resource;