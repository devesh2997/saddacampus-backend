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
				name:'cat_id_unique',
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
			isPrimary: false,
			isForeign: false,
			isCompulsory: false
		},
		{
			name: 'created_on',
			type: 'string',
			isPrimary: false,
			isForeign: false,
			isCompulsory: true
		},
		{
			name: 'updated_on',
			type: 'string',
			isPrimary: false,
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
			validation_error: error_messages.INVALID_MENU_CATEGORY_ID,
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
		menu_cat_fields[1].ref_model = menu_resc.getRef();
		menu_cat_fields[1].ref_model_field_name = 'menu_id';
		menu_cat_def.fields = menu_cat_fields;
		menu_cat_resc = new Resource('MenuCategory','menu_categories',menu_cat_def);
		db.connect(db.MODE_TEST, function(){
			db.dropTable(menu_resc.table_name, function(){
				done();
			});
		});
	});

	describe('Validate values',function(){
		it.only('should return null when all validations pass',function(){
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
	describe('Create Resource',function(){
		var err,res;
		before(function(done){
			var menu_val = {
				id: 1,
				menu_id: 'fsdafsdf',
				description: 'fdf',
				created_on: '2018-06-06',
				updated_on: '2018-06-06',
			};
			var menu_cat_val = {
				id:1,
				menu_id: 'fsdafsdf',
				category_id: 'dff',
				category_name: 'fsdas'
			};
			menu_resc.create(menu_val,function(e){
				if(e)throw(e);
				menu_cat_resc.create(menu_cat_val,function(error,result){
					err = error;
					res = result;
					done();
				});
			});
		});
		it('error should be null',function(){
			assert.ok(err === null);
		});
	});
	describe.only('Update Resource',function(){
		var err,res;
		before(function(done){
			var menu_val = {
				id: 1,
				menu_id: 'fsdafsdf',
				description: 'fdf',
				created_on: '2018-06-06',
				updated_on: '2018-06-06',
			};
			var menu_cat_val = {
				id:1,
				menu_id: 'fsdafsdf',
				category_id: 'dff',
				category_name: 'fsdas'
			};
			menu_resc.create(menu_val,function(e){
				if(e)throw(e);
				menu_cat_resc.create(menu_cat_val,function(er){
					if(er)throw(er);
					menu_cat_resc.update({
						category_id: 'trs'
					},{
						category_id: 'dff'
					},function(error,result){
						err = error;
						res =result;
						done();
					});
				});
			});
		});
		it('error should be null',function(){
			assert.ok(err === null);
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
