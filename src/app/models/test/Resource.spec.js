var assert = require('assert');
var Resource = require('../Resource');
var validator = require('../../utility/validator');
var error_messages = require('../../config/error_messages');
var db = require('../../lib/sadda-db');

describe('Resource model',function(){
	var menu_resc,menu_cat_resc;
	var menu_def = {};
	var menu_cat_def = {};
	menu_def.indexes = {
		unique:[
			{
				name:'id_unique',
				fields: ['id'],
				duplication_error: 'Duplicate Menu with same id exists'
			}
		],
	}
	menu_cat_def.indexes = {
		unique:[
			{
				name:'id_unique',
				fields: ['id'],
				duplication_error: 'Duplicate Menu category with same id exists'
			}
		],
	}
	var menu_fields = [
		{
			name: 'id',
			type: 'number',
			isPrimary: false,
			isForeign: false,
			isCompulsory: false
		},
		{
			name: 'menu_id',
			type: 'string',
			isPrimary: true,
			isForeign: false,
			isCompulsory: true
		},
		{
			name: 'description',
			type: 'string',
			isPrimary: true,
			isForeign: false,
			isCompulsory: false
		},
		{
			name: 'created_on',
			type: 'string',
			isPrimary: true,
			isForeign: false,
			isCompulsory: true
		},
		{
			name: 'updated_on',
			type: 'string',
			isPrimary: true,
			isForeign: false,
			isCompulsory: true
		},
	];
	var menu_cat_fields = [
		{
			name: 'id',
			type: 'number',
			isPrimary: false,
			isForeign: false,
			isCompulsory: false
		},
		{
			name: 'menu_id',
			type: 'string',
			isPrimary: true,
			isForeign: true,
			isCompulsory: true
		},
		{
			name: 'category_id',
			type: 'string',
			isPrimary: true,
			isForeign: false,
			validator: validator.menuCategoryIdIsValid,
			validation_error: error_messages.INVALID_MENU_CATEGORY_ITEM_ID,
			isCompulsory: true
		},
		{
			name: 'category_name',
			type: 'string',
			isPrimary: false,
			isForeign: false,
			isCompulsory: true
		},
	];
	before(function(done){
		menu_def.fields = menu_fields;
		menu_resc = new Resource('Menu','menus',menu_def);
		menu_cat_fields[2].ref_model = menu_resc;
		menu_cat_fields[2].ref_model_field_name = 'menu_id';
		menu_cat_def.fields = menu_cat_fields;
		menu_cat_resc = new Resource('MenuCategory','menu_categories',menu_cat_fields);
		db.connect(db.MODE_TEST, function(){
			db.dropTable(menu_resc.table_name, function(){
				done();
			});
		});
	});


	describe('Check for fields',function(){
		it('When field name exists it returns true',function(){
			assert.ok(menu_resc.checkForField('description'));
		});
		it('When field name does not exists it returns false',function(){
			assert.ok(!menu_resc.checkForField('test'));
		});
	});

	describe.only('Validate values',function(){
		it('should return null when all validations pass',function(){
			var values = {
				menu_id: 'fsdafsdf',
				description: 'fdf',
				created_on: 'fsdas',
				updated_on: 'sdfd',
			};
			assert.ok(menu_resc.validateValues(values) === null);
		});
		describe('invalid field is provided',function(){
			var res;
			var values = {
				menu_i: 'fsdafsdf',
				description: 'fdf',
				created_on: 'fsdas',
				updated_on: 'sdfd',
			};
			before(function(){
				res = menu_resc.validateValues(values);
			});
			it('should return error',function(){
				assert.ok(res instanceof Error);
			});
		});
		describe('invalid value is provided',function(){
			var res;
			var values = {
				menu_i: 'fsdafsdf',
				category_id: 'df',
				category_name: 'fsdas'
			};
			before(function(){
				res = menu_cat_resc.validateValues(values);
			});
			it('should return error',function(){
				assert.ok(res instanceof Error);
			});
		});
		describe('invalid value and field is provided',function(){
			var res;
			var values = {
				menu_i: 'fsdafsdf',
				category_id: 'df',
				category_nme: 'fsdas'
			};
			before(function(){
				res = menu_cat_resc.validateValues(values);
			});
			it('should return error',function(){
				assert.ok(res instanceof Error);
			});
		});
		describe('invalid value type is provided',function(){
			var res;
			var values = {
				menu_i: 'fsdafsdf',
				category_id: 'ddf',
				category_name: 5
			};
			before(function(){
				res = menu_cat_resc.validateValues(values);
			});
			it('should return error',function(){
				assert.ok(res instanceof Error);
			});
		});
	});
	describe('Insert Resource',function(){
		var args = {menu_id:'qwerty',description:'ABC',created_on:'2018-10-10',updated_on:'2018-10-10'};
		var err,res;
		before(function(done){
			menu_resc.insert(args,function(error,result){
				res = result;
				err = error;
				done();
			});
		});
		it('error should be null',function(){
			assert.ok(err === null);
		});
		it('should have Menu object in result',function(){
			assert.ok(res.Menu);
		});
	});
	afterEach(function(done){
		db.dropTable(menu_resc.table_name, function(){
			done();
		});
	});
	after(function(done){
		db.dropTable(menu_resc.table_name, function(){
			db.end();
			done();
		});
	});
});
