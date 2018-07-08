var error_messages = require('../config/error_messages');

//Resource field type def
/**
 * Resource field object.
 * @typedef {Object} Field
 * @property {String} name
 * @property {Object} type
 * @property {boolean} isPrimary
 * @property {boolean} isForeign
 * @property {String} reference_table
 * @property {String} reference_field
 * @property {function} validator
 * @property {String} validation_error
 * @property {boolean} isCompulsory
 */

/**
 * Resource model
 * @param {String} table_name
 * @param {Field[]} fields
 */
var Resource = function(table_name,fields){
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
			if(resc_field.validator){
				if(!resc_field.validator(field[field_name]) || typeof field_name !== resc_field.type){
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



module.exports = Resource;
