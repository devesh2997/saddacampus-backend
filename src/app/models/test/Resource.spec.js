var assert = require('assert');
var Resource = require('../Resource');
var validator = require('../../utility/validator');
var error_messages = require('../../config/error_messages');

describe('Resource model',function(){
	var fields_test = [
		{
			name: 'menu_id',
			type: 'string',
			isPrimary: true,
			isForeign: true,
			reference_table: 'menus',
			reference_field: 'menu_id',
			isCompulsory: true
		},
		{
			name: 'category_id',
			type: 'string',
			isPrimary: true,
			isForeign: true,
			reference_table: 'menu_categories',
			reference_field: 'category_id',
			validator: validator.menuCategoryIdIsValid,
			validation_error: error_messages.INVALID_MENU_CATEGORY_ID,
			isCompulsory: true
		},
		{
			name: 'item_id',
			type: 'number',
			isPrimary: true,
			isForeign: false,
			reference_table: 'menus',
			reference_field: 'menu_id',
			isCompulsory: true
		},
		{
			name: 'name',
			type: 'string',
			isPrimary: false,
			isForeign: false,
			validator: validator.menuCategoryItemNameIsValid,
			validation_error: error_messages.INVALID_MENU_CATEGORY_ITEM_NAME,
			isCompulsory: true
		},
		{
			name: 'cuisine',
			type: 'string',
			isPrimary: false,
			isForeign: false,
			isCompulsory: false
		},
	]
	describe('Check for fields',function(){
		var resc;
		before(function(){
			resc = new Resource('table',fields_test);
		});
		it('When field name exists it returns true',function(){
			assert.ok(resc.checkForField('cuisine'));
		});
		it('When field name does not exists it returns false',function(){
			assert.ok(!resc.checkForField('test'));
		});
	});

	describe.only('Validate values',function(){
		var resc;
		before(function(){
			resc = new Resource('table',fields_test);
		});
		it('should return allCorrect:true when all validations pass',function(){
			var values = [
				{'menu_id': 'fsdafsdf'},
				{'category_id': 'fdf'},
				{'name': 'fsdas'},
				{'item_id': 3},
				{'cuisine': 'fads'}
			];
			assert.ok(resc.validateValues(values).allCorrect);
		});
		describe('invalid field is provided',function(){
			var res;
			var values = [
				{'menu_i': 'fsdafsdf'},
				{'category_id': 'fd'},
				{'name': 'fsdas'},
				{'item_id': 3},
				{'cuisine': 'fads'}
			];
			before(function(){
				res = resc.validateValues(values);
			});
			it('should return allCorrect:false',function(){
				assert.ok(!res.allCorrect);
			});
			it('should set the err for incorrect field',function(){
				assert.ok(res.values[0].err === error_messages.INVALID_RESOURCE_FIELD);
			});
		});
		describe('invalid value is provided',function(){
			var res;
			var values = [
				{'menu_id': 'fsdafsdf'},
				{'category_id': 'fd'},
				{'name': 'fsdas'},
				{'item_id': 3},
				{'cuisine': 'fads'}
			];
			before(function(){
				res = resc.validateValues(values);
			});
			it('should return allCorrect:false',function(){
				assert.ok(!res.allCorrect);
			});
			it('should set the err for incorrect field',function(){
				assert.ok(res.values[1].err === error_messages.INVALID_MENU_CATEGORY_ID);
			});
		});
		describe('invalid value and field is provided',function(){
			var res;
			var values = [
				{'menu_i': 'fsdafsdf'},
				{'category_id': 'fd'},
				{'name': 'fsdas'},
				{'item_id': 3},
				{'cuisine': 'fads'}
			];
			before(function(){
				res = resc.validateValues(values);
			});
			it('should return allCorrect:false',function(){
				assert.ok(!res.allCorrect);
			});
			it('should set the err for incorrect fields',function(){
				assert.ok(res.values[1].err === error_messages.INVALID_MENU_CATEGORY_ID && res.values[0].err === error_messages.INVALID_RESOURCE_FIELD);
			});
		});

	});
});
