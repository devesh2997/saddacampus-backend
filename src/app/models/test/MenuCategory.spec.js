var assert = require('assert');
var Menu = require('../food/_Menu');
var MenuCategory = require('../food/_MenuCategory')
var error_messages = require('../../config/error_messages');
var db = require('../../lib/sadda-db');

describe('MenuCategory model',function(){
	before(function(done){
		db.connect(db.MODE_TEST, function(){
			db.dropTable(db.tables.menus.name, function(){
				done();
			});
		});
	});
	describe('Add categories',function(){
		afterEach(function(done){
			db.dropTable(db.tables.menus.name, function(){
				done();
			});
		});
		describe('When valid parameter is provided and menu exists',function(){
			var err, res;
			before(function(done){
				Menu.create({},function(e, r){
					if(e)throw(e);
					MenuCategory.addCategories({
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
				assert.ok(res.affectedRows === 2);
			});
		});
		describe('When two categories with same category_id is provided',function(){
			var err;
			before(function(done){
				Menu.create({},function(e, r){
					if(e)throw(e);
					MenuCategory.addCategories({
						menu_id: r.Menu.menu_id,
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
			})
			it('should return with error and correct error message should be set',function(){
				assert.ok(err && err.message===error_messages.DUPLICATE_MENU_CATEGORY);
			});
		});
		describe('When category with id same as an existing id is provided',function(){
			var err;
			before(function(done){
				Menu.create({},function(e, r){
					if(e)throw(e);
					MenuCategory.addCategories({
						menu_id: r.Menu.menu_id,
						categories: [
							{
								category_id: 'RIC',
								category_name: 'Rice and Biryani'
							}
						]
					},function(error){
						if(error)throw(error);
						MenuCategory.addCategories({
							menu_id: r.Menu.menu_id,
							categories: [
								{
									category_id: 'RIC',
									category_name: 'Re and Biryani'
								}
							]
						},function(error){
							err = error;
							done();
						});
					});
				});
			})
			it('should return with error and correct error message should be set',function(){
				assert.ok(err && err.message===error_messages.DUPLICATE_MENU_CATEGORY);
			});
		});
		describe('When menu does not exist',function(){
			var err;
			before(function(done){
				MenuCategory.addCategories({
					menu_id: 'fdasfasdfsadfsd',
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
				MenuCategory.addCategories({menu_id:''},function(err){
					assert.ok(err && err.message === error_messages.MISSING_PARAMETERS);
					done();
				});
			});
			it('categories is not provided',function(done){
				MenuCategory.addCategories({menu_id:'fsad'},function(err){
					assert.ok(err && err.message === error_messages.MISSING_PARAMETERS);
					done();
				});
			});
			it('invalid category id is provided',function(done){
				Menu.create({},function(e, r){
					if(e)throw(e);
					MenuCategory.addCategories({
						menu_id: r.Menu.menu_id,
						categories: [
							{
								category_id: 'RI',
								category_name: 'Rice and Biryani'
							}
						]
					},function(error){
						assert.ok(error instanceof Error && error.message ===error_messages.INVALID_MENU_CATEGORY_ID);
						done();
					});
				});
			});
		});
	});
	describe('Get categories',function(){
		var menu_id_test;
		before(function(done){
			Menu.create({},function(e, r){
				if(e)throw(e);
				menu_id_test = r.Menu.menu_id;
				MenuCategory.addCategories({
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
				},function(error){
					if(error)throw(error);
					done();
				});
			});
		});
		describe('When valid menu_id is passed',function(){
			var err,res;
			before(function(done){
				MenuCategory.getCategories({menu_id: menu_id_test},function(error,result){
					err = error;
					res = result;
					done();
				});
			});
			it('error should be null',function(){
				assert.ok(err === null);
			});
			it('result should have categories array',function(){
				assert.ok(res.hasOwnProperty('categories'));
			});
			it('length of categories array should be 2',function(){
				assert.ok(res.categories.length === 2);
			});
			it('category_id should be correct',function(){
				assert.ok(res.categories[0].category_id === 'RIC' || res.categories[0].category_id==='BEV');
			});
		});
		describe('When menu_id is not provided',function(){
			var err;
			before(function(done){
				MenuCategory.getCategories({},function(error){
					err = error;
					done();
				});
			});
			it('error should not be null',function(){
				assert.ok(err);
			});
			it('correct error message should be set',function(){
				assert.ok(err.message === error_messages.MISSING_PARAMETERS);
			});
		});
		describe('When menu does not exist',function(){
			var err;
			before(function(done){
				MenuCategory.getCategories({menu_id: 'fsadfsd'},function(error){
					err = error;
					done();
				});
			});
			it('error should not be null',function(){
				assert.ok(err);
			});
			it('correct error message should be set',function(){
				assert.ok(err.message === error_messages.MENU_DOES_NOT_EXIST);
			});
		})
	});
	describe('Delete category',function(){
		var menu_id_test;
		before(function(done){
			Menu.create({},function(e, r){
				if(e)throw(e);
				menu_id_test = r.Menu.menu_id;
				MenuCategory.addCategories({
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
				},function(error){
					if(error)throw(error);
					done();
				});
			});
		});
		describe('When valid menu_id and category_id is passed',function(){
			var err,res;
			before(function(done){
				MenuCategory.delete({menu_id: menu_id_test,category_id:'RIC'},function(error,result){
					err = error;
					res = result;
					done();
				});
			});
			it('error should be null',function(){
				assert.ok(err === null);
			});
			it('noOfRowsDeleted should be 1',function(){
				assert.ok(res.affectedRows === 1);
			});
		});
		describe('When menu_id is not provided',function(){
			var err;
			before(function(done){
				MenuCategory.delete({},function(error){
					err = error;
					done();
				});
			});
			it('error should not be null',function(){
				assert.ok(err);
			});
			it('correct error message should be set',function(){
				assert.ok(err.message === error_messages.MISSING_PARAMETERS);
			});
		});
		describe('When category_id is not provided',function(){
			var err;
			before(function(done){
				MenuCategory.delete({},function(error){
					err = error;
					done();
				});
			});
			it('error should not be null',function(){
				assert.ok(err);
			});
			it('correct error message should be set',function(){
				assert.ok(err.message === error_messages.MISSING_PARAMETERS);
			});
		});
		describe('When menu does not exist',function(){
			var err;
			before(function(done){
				MenuCategory.delete({menu_id: 'fsadfsd',category_id: 'RIC'},function(error){
					err = error;
					done();
				});
			});
			it('error should not be null',function(){
				assert.ok(err);
			});
			it('correct error message should be set',function(){
				assert.ok(err.message === error_messages.MENU_DOES_NOT_EXIST);
			});
		});
		describe('When invalid category_id is provided',function(){
			var err;
			before(function(done){
				MenuCategory.delete({menu_id: 'fsadfsd',category_id: 'RI'},function(error){
					err = error;
					done();
				});
			});
			it('error should not be null',function(){
				assert.ok(err);
			});
			it('correct error message should be set',function(){
				assert.ok(err.message === error_messages.INVALID_MENU_CATEGORY_ID);
			});
		});
	});
	describe('Update category',function(){
		var menu_id_test;
		before(function(done){
			Menu.create({},function(e, r){
				if(e)throw(e);
				menu_id_test = r.Menu.menu_id;
				MenuCategory.addCategories({
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
				},function(error){
					if(error)throw(error);
					done();
				});
			});
		});
		describe('When valid menu_id and category_id is passed',function(){
			var err,res;
			before(function(done){
				MenuCategory.update({
						menu_id: menu_id_test,
						category_id:'RIC',
						updated_category:{
							category_id: 'BRE',
							category_name: 'Breads'
						}
					},function(error,result){
					err = error;
					res = result;
					done();
				});
			});
			it('error should be null',function(){
				assert.ok(err === null);
			});
			it('noOfRowsDeleted should be 1',function(){
				assert.ok(res.affectedRows === 1);
			});
		});
		describe('When menu_id is not provided',function(){
			var err;
			before(function(done){
				MenuCategory.update({},function(error){
					err = error;
					done();
				});
			});
			it('error should not be null',function(){
				assert.ok(err);
			});
			it('correct error message should be set',function(){
				assert.ok(err.message === error_messages.MISSING_PARAMETERS);
			});
		});
		describe('When category_id is not provided',function(){
			var err;
			before(function(done){
				MenuCategory.update({},function(error){
					err = error;
					done();
				});
			});
			it('error should not be null',function(){
				assert.ok(err);
			});
			it('correct error message should be set',function(){
				assert.ok(err.message === error_messages.MISSING_PARAMETERS);
			});
		});
		describe('When menu does not exist',function(){
			var err;
			before(function(done){
				MenuCategory.update({
					menu_id: 'rewfsad',
					category_id:'RIC',
					updated_category:{
						category_id: 'BRE',
						category_name: 'Breads'
					}
				},function(error){
					err = error;
					done();
				});
			});
			it('error should not be null',function(){
				assert.ok(err);
			});
			it('correct error message should be set',function(){
				assert.ok(err.message === error_messages.MENU_DOES_NOT_EXIST);
			});
		});
		describe('When invalid category_id is provided',function(){
			var err;
			before(function(done){
				MenuCategory.delete({
					menu_id: 'rewfsad',
					category_id:'RI',
					updated_category:{
						category_id: 'BRE',
						category_name: 'Breads'
					}
				},function(error){
					err = error;
					done();
				});
			});
			it('error should not be null',function(){
				assert.ok(err);
			});
			it('correct error message should be set',function(){
				assert.ok(err.message === error_messages.INVALID_MENU_CATEGORY_ID);
			});
		});
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
