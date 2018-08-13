var assert = require('assert');
var db = require('./../../../lib/sadda-db');
var MenuCustomisationOption = require("./../../food/MenuCustomizationOptions");
var Menu = require("./../../food/Menu");
var MenuCustomisation = require('./../../food/MenuCustomization');

 describe("Menu category Items modal",function(){
    var menu_id ;
    var customisation_id;
    before(function(done){
        db.connect(db.MODE_TEST, function(){
            db.dropTable("menu_customisation_options", function(){
                done();
            });
        });
    });
    before(function(done){
        Menu.addMenu({description:'test'},function(err,res){
            if(err)throw err;
            menu_id = res.Menus.menu_id;
            MenuCustomisation.addCustomisation({
                menu_id: menu_id,
                menu_customisation : [
                    {
                        name: 'BUTTER',
                        customisation_id : 'BUT',
                        min_selections : 0,
                        max_selections : 2
                    }
                ]
            },function(err,result){
                customisation_id = result.result.BUTTER.customisation_id;
                done();
            });
        });
    });
    describe("Adding new menu customisation option",function(){
        var error;
        var res = {};
        before(function(done){
            MenuCustomisationOption.addCustomisationOptions({
                menu_id: menu_id,
                customisation_id: customisation_id,
                customisation_options : [
                    {
                        name : 'Cheese',
                        price : 140 
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
    describe("Finding for menu categories items",function(){
        var error;
        var res;
        before(function(done){
            MenuCustomisationOption.addCustomisationOptions({
                menu_id: menu_id,
                customisation_id: customisation_id,
                customisation_options : [
                    {
                        name : 'CHEESE',
                        price : 140 
                    }
                ]
            },function(err,result){
                MenuCustomisationOption.findCustomisationOptions({
                    menu_id : menu_id,
                    customisation_id : customisation_id,
                    customisation_option_id : result.result.CHEESE.customisation_option_id
                },function(err,result){
                    error = err;
                    res = result;
                    done();
                })
            });
        });
        it("error should be null",function(){
            assert.ok(error === null);
        });
        it("checking the name in result",function(){
            assert.ok(res[0].name === 'CHEESE');
        });
        it("checking category_id in result",function(){
            assert.ok(res[0].customisation_id === customisation_id);
        })
    });
    describe("Updating menu customisation options",function(){
        var error;
        var res;
        before(function(done){
            MenuCustomisationOption.addCustomisationOptions({
                menu_id: menu_id,
                customisation_id: customisation_id,
                customisation_options : [
                    {
                        name : 'CHEESE',
                        price : 140 
                    }
                ]
            },function(err,result){
                MenuCustomisationOption.updateCustomisationOption({
                    menu_id : menu_id,
                    customisation_id : customisation_id,
                    customisation_option_id : result.result.CHEESE.customisation_option_id,
                    updates : {
                        name : 'Ghee',
                        price : 500
                    }
                },function(err,result){
                    error = err;
                    res = result;
                    done();
                })
            });
        });
        it("error should be null",function(){
            assert.ok(error === null);
        });
        it("checking the name in result",function(){
            assert.ok(res[0].name === 'Ghee');
        });
        it("checking the price in result",function(){
            assert.ok(res[0].price === 500);
        });
    });
    describe("Deleting menu customisation options",function(){
        var error;
        var res;
        before(function(done){
            MenuCustomisationOption.addCustomisationOptions({
                menu_id: menu_id,
                customisation_id: customisation_id,
                customisation_options : [
                    {
                        name : 'CHEESE',
                        price : 140 
                    }
                ]
            },function(err,result){
                MenuCustomisationOption.deleteCustomisationOption({
                    menu_id : menu_id,
                    customisation_id : customisation_id,
                    customisation_option_id : result.result.CHEESE.customisation_option_id
                },function(err,result){
                    error = err;
                    res = result;
                    done();
                })
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
		db.dropTable('menu_customisation_options', function(){
			done();
		});
    });
    after(function(done){
        db.dropTable('menu_customisations',function(){
            done();
        });
    });
    after(function(done){
        db.dropTable('menus', function(){
			done();
		});
    })
 })
