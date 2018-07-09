var assert = require('assert');
var Resource = require('../Resource');
var validator = require('../../utility/validator');
var error_messages = require('../../config/error_messages');
var db = require('../../lib/sadda-db');

describe('Resource model',function(){
	var resc,resc2;
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
			validation_error:error_messages.INVALID_MENU_CATEGORY_ITEM_ID,
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
		{
			name: 'encrypted_password',
			type: 'password',
			isPrimary: false,
			isForeign: false,
			validator: validator.passwordIsValid,
			validation_error: error_messages.INVALID_PASSWORD,
			isCompulsory: true
		},
	];
	var fields_test_2 = [
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
			name: 'category_name',
			type: 'string',
			isPrimary: false,
			isForeign: false,
			validation_error:error_messages.INVALID_MENU_CATEGORY_ITEM_NAME,
			isCompulsory: true
		},
	]
	before(function(done){
		resc2 = new Resource('MenuCategory','menu_categories',fields_test_2);
		fields_test[1]['ref_model'] = resc2;
		fields_test[1]['ref_model_field_name'] = fields_test_2[1].name;
		resc = new Resource('Table','table',fields_test);
		db.connect(db.MODE_TEST, function(){
			db.dropTable(resc2.table_name, function(){
				done();
			});
		});
	});


	describe('Check for fields',function(){
		it('When field name exists it returns true',function(){
			assert.ok(resc.checkForField('cuisine'));
		});
		it('When field name does not exists it returns false',function(){
			assert.ok(!resc.checkForField('test'));
		});
	});

	describe('Validate values',function(){
		var resc;
		before(function(){
			resc = new Resource('Table','table',fields_test);
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
		describe('invalid value type is provided',function(){
			var res;
			var values = [
				{'menu_id': 'fsdafsdf'},
				{'category_id': 'fd3'},
				{'name': 'fsdas'},
				{'item_id': 'fsd'},
				{'cuisine': 'fads'}
			];
			before(function(){
				res = resc.validateValues(values);
			});
			it('should return allCorrect:false',function(){
				assert.ok(!res.allCorrect);
			});
			it('should set the err for incorrect fields',function(){
				assert.ok(res.values[3].err === error_messages.INVALID_MENU_CATEGORY_ITEM_ID);
			});
		});
		describe('invalid password value is provided',function(){
			var res;
			var values = [
				{'menu_id': 'fsdafsdf'},
				{'category_id': 'fd3'},
				{'name': 'fsdas'},
				{'item_id': 3},
				{'cuisine': 'fads'},
				{'encrypted_password': 'fsd'}
			];
			before(function(){
				res = resc.validateValues(values);
			});
			it('should return allCorrect:false',function(){
				assert.ok(!res.allCorrect);
			});
			it('should set the err for incorrect fields',function(){
				assert.ok(res.values[5].err === error_messages.INVALID_PASSWORD);
			});
		});

	});
	var args2 = {menu_id:'qwerty',category_id:'ABC',category_name:'Rice'}
	describe.only('Create Resource',function(){
		var err,res;
		before(function(done){
			resc2.create(args2,function(error,result){
				res = result;
				err = error;
				console.log(res);
				console.log(err);
				done();
			});
		});
		it('error should be null',function(){
			assert.ok(err === null);
		});
	});
	afterEach(function(done){
		db.dropTable(resc2.table_name, function(){
			done();
		});
	});
	after(function(done){
		db.dropTable(resc2.table_name, function(){
			db.end();
			done();
		});
	});
});
