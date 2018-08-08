var assert = require('assert');
var Menu = require('../food/_Menu');
var MenuCustomisation = require('../food/_MenuCustomisation')
var error_messages = require('../../config/error_messages');
var db = require('../../lib/sadda-db');

describe('MenuCustomisation model',function(){
	before(function(done){
		db.connect(db.MODE_TEST, function(){
			db.dropTable(db.tables.menus.name, function(){
				done();
			});
		});
	});
	describe('Add customisations',function(){
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
					MenuCustomisation.addCustomisations({
						menu_id: r.Menu.menu_id,
						customisations: [
							{
								customisation_id: 'CS1',
								name: 'Extras',
								min_selections: 1,
								max_selections: 2
							},
							{
								customisation_id: 'CS2',
								name: 'Extras',
								min_selections: 1,
								max_selections: 2
							}
						]
					},function(error,result){
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
		describe('When two customisations with same customisation_id is provided',function(){
			var err;
			before(function(done){
				Menu.create({},function(e){
					if(e)throw(e);
					Menu.create({},function(e,r){
						if(e)throw(e);
						MenuCustomisation.addCustomisations({
							menu_id: r.Menu.menu_id,
							customisations: [
								{
									customisation_id: 'CS1',
									name: 'Extras',
									min_selections: 1,
									max_selections: 2
								},
								{
									customisation_id: 'CS1',
									name: 'Extras',
									min_selections: 1,
									max_selections: 2
								}
							]
						},function(error){
							err = error;
							done();
						});
					});
				});
			});
			it('should return with error and correct error message should be set',function(){
				assert.ok(err && err.message===error_messages.DUPLICATE_MENU_CUSTOMISATION);
			});
		});
		describe('When customisations with id same as an existing id is provided',function(){
			var err;
			before(function(done){
				Menu.create({},function(e, r){
					if(e)throw(e);
					MenuCustomisation.addCustomisations({
						menu_id: r.Menu.menu_id,
						customisations: [
							{
								customisation_id: 'CS1',
								name: 'Extras',
								min_selections: 1,
								max_selections: 2
							}
						]
					},function(error){
						if(error)throw(error);
						MenuCustomisation.addCustomisations({
							menu_id: r.Menu.menu_id,
							customisations: [
								{
									customisation_id: 'CS1',
									name: 'Extras',
									min_selections: 1,
									max_selections: 2
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
				assert.ok(err && err.message===error_messages.DUPLICATE_MENU_CUSTOMISATION);
			});
		});
		describe('When menu does not exist',function(){
			var err;
			before(function(done){
				MenuCustomisation.addCustomisations({
					menu_id: 'fsdafds',
					customisations: [
						{
							customisation_id: 'CS1',
							name: 'Extras',
							min_selections: 1,
							max_selections: 2
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
				MenuCustomisation.addCustomisations({menu_id:''},function(err){
					assert.ok(err && err.message === error_messages.MISSING_PARAMETERS);
					done();
				});
			});
			it('customisation_id is not provided',function(done){
				MenuCustomisation.addCustomisations({customisation_id:'fsd'},function(err){
					assert.ok(err && err.message === error_messages.MISSING_PARAMETERS);
					done();
				});
			});
			it('invalid customisation id is provided',function(done){
				Menu.create({},function(e){
					if(e)throw(e);
					MenuCustomisation.addCustomisations({
						menu_id: 'fsdafds',
						customisations: [
							{
								customisation_id: 'C1',
								name: 'Extras',
								min_selections: 1,
								max_selections: 2
							}
						]
					},function(error){
						assert.ok(error instanceof Error && error.message ===error_messages.INVALID_MENU_CUSTOMISATION_ID);
						done();
					});
				});
			});
		});
	});
	describe('Get customisations',function(){
		var menu_id_test;
		before(function(done){
			Menu.create({},function(e, r){
				if(e)throw(e);
				menu_id_test = r.Menu.menu_id;
				MenuCustomisation.addCustomisations({
					menu_id: r.Menu.menu_id,
					customisations: [
						{
							customisation_id: 'CS1',
							name: 'Extras',
							min_selections: 1,
							max_selections: 2
						},
						{
							customisation_id: 'CS2',
							name: 'Extras',
							min_selections: 1,
							max_selections: 2
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
				MenuCustomisation.getCustomisations({menu_id: menu_id_test},function(error,result){
					err = error;
					res = result;
					done();
				});
			});
			it('error should be null',function(){
				assert.ok(err === null);
			});
			it('result should have categories array',function(){
				assert.ok(res.hasOwnProperty('customisations'));
			});
			it('length of categories array should be 2',function(){
				assert.ok(res.customisations.length === 2);
			});
			it('customisation_id should be correct',function(){
				assert.ok(res.customisations[0].customisation_id === 'CS1' || res.categories[0].customisation_id==='CS2');
			});
		});
		describe('When menu_id is not provided',function(){
			var err;
			before(function(done){
				MenuCustomisation.getCustomisations({},function(error){
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
				MenuCustomisation.getCustomisations({menu_id: 'fsadfsd'},function(error){
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
	describe('Delete customisation',function(){
		var menu_id_test;
		before(function(done){
			Menu.create({},function(e, r){
				if(e)throw(e);
				menu_id_test = r.Menu.menu_id;
				MenuCustomisation.addCustomisations({
					menu_id: r.Menu.menu_id,
					customisations: [
						{
							customisation_id: 'CS1',
							name: 'Extras',
							min_selections: 1,
							max_selections: 2
						},
						{
							customisation_id: 'CS2',
							name: 'Extras',
							min_selections: 1,
							max_selections: 2
						}
					]
				},function(error){
					if(error)throw(error);
					done();
				});
			});
		});
		describe('When valid menu_id and customisation_id is passed',function(){
			var err,res;
			before(function(done){
				MenuCustomisation.delete({menu_id: menu_id_test,customisation_id:'CS1'},function(error,result){
					err = error;
					res = result;
					console.log(err);
					done();
				});
			});
			it('error should be null',function(){
				assert.ok(err === null);
			});
			it('affectedRows should be 1',function(){
				assert.ok(res.affectedRows === 1);
			});
		});
		describe('When menu_id is not provided',function(){
			var err;
			before(function(done){
				MenuCustomisation.delete({},function(error){
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
		describe('When cutomisation_id is not provided',function(){
			var err;
			before(function(done){
				MenuCustomisation.delete({},function(error){
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
				MenuCustomisation.delete({menu_id: 'fsadfsd',customisation_id: 'CS1'},function(error){
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
		describe('When invalid customisation_id is provided',function(){
			var err;
			before(function(done){
				MenuCustomisation.delete({menu_id: 'fsadfsd',customisation_id: 'RI'},function(error){
					err = error;
					done();
				});
			});
			it('error should not be null',function(){
				assert.ok(err);
			});
			it('correct error message should be set',function(){
				assert.ok(err.message === error_messages.INVALID_MENU_CUSTOMISATION_ID);
			});
		});
	});
	describe('Update customisation',function(){
		var menu_id_test;
		before(function(done){
			Menu.create({},function(e, r){
				if(e)throw(e);
				menu_id_test = r.Menu.menu_id;
				MenuCustomisation.addCustomisations({
					menu_id: r.Menu.menu_id,
					customisations: [
						{
							customisation_id: 'CS1',
							name: 'Extras',
							min_selections: 1,
							max_selections: 2
						},
						{
							customisation_id: 'CS2',
							name: 'Extras',
							min_selections: 1,
							max_selections: 2
						}
					]
				},function(error){
					if(error)throw(error);
					done();
				});
			});
		});
		describe('When valid menu_id and customisation_id is passed',function(){
			var err,res;
			before(function(done){
				MenuCustomisation.update({
						menu_id: menu_id_test,
						customisation_id:'CS1',
						updated_customisation:
						{
							customisation_id: 'CS3',
							name: 'Extras 3',
							min_selections: 1,
							max_selections: 2
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
				MenuCustomisation.update({},function(error){
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
		describe('When customisation_id is not provided',function(){
			var err;
			before(function(done){
				MenuCustomisation.update({menu_id:'fs'},function(error){
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
				MenuCustomisation.update({
					menu_id: 'rewfsad',
					customisation_id:'RIC',
					updated_customisation:{
						customisation_id: 'CS2',
						name: 'Extras 3',
						min_selections: 1,
						max_selections: 2
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
		describe('When invalid customisation_id is provided',function(){
			var err;
			before(function(done){
				MenuCustomisation.delete({
					menu_id: 'rewfsad',
					customisation_id:'CS',
					updated_customisation:{
						customisation_id: 'CS4',
						name: 'Extras 3',
						min_selections: 1,
						max_selections: 2
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
				assert.ok(err.message === error_messages.INVALID_MENU_CUSTOMISATION_ID);
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
