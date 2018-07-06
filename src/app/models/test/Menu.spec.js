var assert = require('assert');
var Menu = require('../Menu');
var error_messages = require('../../config/error_messages');
var db = require('../../lib/sadda-db');

describe('Menu model', function(){
	before(function(done){
		db.connect(db.MODE_TEST, function(){
			db.dropTable(db.tables.menus.name, function(){
				done();
			});
		});
	});
	describe('Create menu', function(){
		var err,res;
		before(function(done){
			Menu.create({description: 'afsdf'},function(error, result){
				err = error;
				res = result;
				done();
			});
		});
		it('error should be set to null',function(){
			assert.ok(err === null);
		});
		it('should return menu object',function(){
			assert.ok(res.Menu);
		});
		it('menu object should contain menu_id',function(){
			assert.ok(res.Menu.menu_id);
		});
		it('menu object should contain correct description',function(){
			assert.ok(res.Menu.description === 'afsdf');
		});
		it('menu object should contain created_on',function(){
			assert.ok(res.Menu.created_on);
		});
		it('menu object should contain updated_on',function(){
			assert.ok(res.Menu.updated_on);
		});
	});
	describe('Find by id', function(){
		describe('Returns callback with error and sets the correct error messages when...', function(){
			it('menu_id is not provided',function(done){
				Menu.findById({
				},function(err){
					assert.ok(err && err.message == error_messages.MISSING_PARAMETERS);
					done();
				});
			});
		});
		describe('When menu does not exist',function(){
			var err,res;
			before(function(done){
				Menu.findById({menu_id: 'fsdf'}, function(error, result){
					err = error;
					res = result;
					done();
				});
			});
			it('error is set to null',function(){
				assert.ok(err === null);
			});
			it('result containes empty Menu object',function(){
				assert.ok(!res.Menu);
			});
		});
	});
	describe('Add categories',function(){
		describe('When valid parameter is provided and menu exists',function(){
			var err, res;
			before(function(done){
				Menu.create({},function(e, r){
					if(e)throw(e);
					Menu.addCategories({
						menu_id: r.Menu.menu_id,
						categories: [
							{
								category_id: 'RIC',
								category_name: 'Rice and Biryani'
							},
							{
								category_id: 'BEV',
								category_name: 'Beverages'
							}
						]
					},function(error, result){
						err = error;
						res = result;
						done();
					});
				});
			});
			it('error should be set to null',function(){
				assert.ok(err === null);
			});
			it('noOfCategoriesAdded added should be equal to 2',function(){
				assert.ok(res.noOfCategoriesAdded === 2);
			})
		});
		describe('When menu does not exist',function(){
			var err;
			before(function(done){
				Menu.addCategories({
					menu_id: 'fdasfasdfsadfsd',
					categories: [
						{
							category_id: 'RIC',
							category_name: 'Rice and Biryani'
						},
						{
							category_id: 'RIC',
							category_name: 'Beverages'
						}
					]
				},function(error){
					err = error;
					done();
				});
			});
			it('should return with error and correct error message should be set',function(){
				assert.ok(err && err.message===error_messages.MENU_DOES_NOT_EXIST);
			});
		});
		describe('returns with error and sets correct error message when',function(){
			it('menu_id is not provided',function(done){
				Menu.addCategories({menu_id:''},function(err){
					assert.ok(err && err.message === error_messages.MISSING_PARAMETERS);
					done();
				});
			});
			it('categories is not provided',function(done){
				Menu.addCategories({menu_id:'fsad'},function(err){
					assert.ok(err && err.message === error_messages.MISSING_PARAMETERS);
					done();
				});
			});
		})
	});
	afterEach(function(done){
		db.dropTable(db.tables.menus.name, function(){
			done();
		});
	});
	after(function(done){
		db.dropTable(db.tables.menus.name, function(){
			db.end();
			done();
		});
	});
});
