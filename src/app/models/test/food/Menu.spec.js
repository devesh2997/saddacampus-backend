var assert = require('assert');
var error_messages = require('./../../../config/error_messages');
var db = require('./../../../lib/sadda-db');
var Menu = require("./../../food/Menu");

describe("Menu modal",function(){
    before(function(done){
        db.connect(db.MODE_TEST, function(){
			db.dropTable("menus", function(){
				done();
			});
		});
    });
    describe("Adding new menu",function(){
        var error;
        var res = {};
        before(function(done){
            Menu.addMenu({description:"this is for testing"},function(err,result){
                res = result;
                error = err;
                done();
            });
        });
        it("error is null",function(){
            assert.ok(error === null);
        });
        it('should return menu object',function(){
            assert.ok(res.Menus);
        });
        it('menu object should contain menu_id',function(){
            assert.ok(res.Menus.menu_id);
        });
        it('menu object should contain correct description',function(){
            assert.ok(res.Menus.description === "this is for testing");
        });
        it('menu object should contain created_on',function(){
            assert.ok(res.Menus.created_on);
        });
        it('menu object should contain updated_on',function(){
            assert.ok(res.Menus.updated_on);
        });
    });
    describe("finding menu by id",function(){
        describe("When no id is provided",function(){
            var error ;
            before(function(done){
                Menu.findByIdMenu({},function(err){
                    error = err;
                    done();
                })
            });
            it("checking for the correct error",function(){
                assert.ok(error.message === error_messages.MISSING_PARAMETERS);
            });
        });
        describe("when wrong id is provided",function(){
            var error;
            var res = [];
            before(function(done){
                Menu.findByIdMenu({menu_id:'125ddfrr'},function(err,result){
                    error = err;
                    res = result;
                    done();
                })
            });
            it("error should be null",function(){
                assert.ok(error === null);
            });
            it("empty result",function(){
                assert.ok(res.length === 0);
            });
        })
        describe("when correct menu_id is given",function(){
            var menu_id;
            var error;
            var res = [];
            before(function(done){
                Menu.addMenu({description:"test"},function(err,result){
                    menu_id = result.Menus.menu_id;
                    Menu.findByIdMenu({menu_id : menu_id},function(err,result){
                        error = err;
                        res = result;
                        done();
                    });
                });
            });
            it("error should be null",function(){
                assert.ok(error === null);
            });
            it("checking result",function(){
                assert.ok(res[0].menu_id === menu_id);
            });
        })
    });

    describe("deletion of a menu",function(){
        describe("when no id is provided",function(){
            var error ;
            before(function(done){
                Menu.deleteMenu({},function(err){
                    error = err;
                    done();
                })
            });
            it("checking for the correct error",function(){
                assert.ok(error.message === error_messages.MISSING_PARAMETERS);
            });
        });
        describe("when wrong menu id is povided",function(){
            var error;
            before(function(done){
                Menu.deleteMenu({menu_id:"147sfd"},function(err){
                    error = err;
                    done();
                });
            });
            it("checking for the correct error",function(){
                assert.ok(error.message === error_messages.MENU_DOES_NOT_EXIST);
            });
        });
        describe("when correct menu_id is provided",function(){
            var menu_id;
            var error;
            var res ;
            before(function(done){
                Menu.addMenu({description:"test"},function(err,result){
                    menu_id = result.Menus.menu_id;
                    Menu.deleteMenu({menu_id:menu_id},function(err,result){
                        error = err;
                        res = result;
                        done();
                    });
                });
            });
            it("error should be null",function(){
                assert.ok(error === null);
            });
            it("affected rows should be one",function(){
                assert.ok(res.affectedRows === 1);
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