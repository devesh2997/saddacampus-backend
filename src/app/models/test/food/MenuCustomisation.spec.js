var assert = require('assert');
var db = require('./../../../lib/sadda-db');
var MenuCustomisation = require("./../../food/MenuCustomization");
var Menu = require("./../../food/Menu");

 describe("Menu category modal",function(){
    var menu_id ;
    before(function(done){
        db.connect(db.MODE_TEST, function(){
            db.dropTable("menu_customisations", function(){
                done();
            });
        });
    });
    before(function(done){
        Menu.addMenu({description:'test'},function(err,res){
            if(err)throw err;
            menu_id = res.Menus.menu_id;
            done();
        });
    });
    describe("Adding new menu customisation",function(){
        var error;
        var res = {};
        before(function(done){
            MenuCustomisation.addCustomisation({
                menu_id: menu_id,
                menu_customisation : [
                    {
                        name: 'butter',
                        min_selections : 0,
                        max_selections : 2
                    }
                ]
            },function(err,result){
                error = err;
                res = result;
                done();
            });
        });
        it("error should be null",function(){
            assert.ok(error === null);
        });
        it("checking result succes",function(){
            assert.ok(res.success);
        });
        it("checking error term in result",function(){
            assert.ok(!res.error);
        });
        it("checking for result",function(){
            assert.ok(res.result);
        });
    });
    describe("Finding for menu customisations",function(){
        var error;
        var res;
        before(function(done){
            MenuCustomisation.addCustomisation({
                menu_id: menu_id,
                menu_customisation : [
                    {
                        name: 'butter',
                        min_selections : 0,
                        max_selections : 2
                    }
                ]
            },function(err,result){
                    MenuCustomisation.findMenuCustomisation({menu_id:menu_id,customisation_id : result.result.BUTTER.customisation_id},function(err,result){
                    error = err;
                    res = result;
                    done();
                });
            });
        });
        it("error should be null",function(){
            assert.ok(error === null);
        });
        it("checking the result name",function(){
            assert.ok(res[0].name === 'BUTTER');
        });
        it("checking the result menu_id",function(){
            assert.ok(res[0].menu_id === menu_id);
        })
    });
    describe("Updating menu category",function(){
        var error;
        var res;
        before(function(done){
            MenuCustomisation.addCustomisation({
                menu_id: menu_id,
                menu_customisation : [
                    {
                        name: 'butter',
                        min_selections : 0,
                        max_selections : 2
                    }
                ]
            },function(err,result){
                    MenuCustomisation.updateCustomisation({
                        menu_id:menu_id,
                        customisation_id : result.result.BUTTER.customisation_id, 
                        update: {
                            name : 'Crust'
                        }
                        },function(err,result){
                    error = err;
                    res = result;
                    done();
                });
            });
        });
        it("error should be null",function(){
            assert.ok(error === null);
        });
        it("checking the result",function(){
            assert.ok(res[0].name === 'CRUST');
        });
    });
    describe("Deleting menu category",function(){
        var error;
        var res;
        before(function(done){
            MenuCustomisation.addCustomisation({
                menu_id: menu_id,
                menu_customisation : [
                    {
                        name: 'butter',
                        min_selections : 0,
                        max_selections : 2
                    }
                ]
            },function(err,result){
                    MenuCustomisation.deleteCustomisation({menu_id:menu_id,customisation_id : result.result.BUTTER.customisation_id},function(err,result){
                    error = err;
                    res = result;
                    done();
                });
            });
        });
        it("error should be null",function(){
            assert.ok(error === null);
        });
        it("checking the no of affected rows",function(){
            assert.ok(res.affectedRows === 1);
        });
    });
    afterEach(function(done){
		db.dropTable('menu_customisations', function(){
			done();
		});
    });
    after(function(done){
        db.dropTable('menus', function(){
			done();
		});
    })
 })
