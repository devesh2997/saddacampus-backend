var assert = require('assert');
var db = require('./../../../lib/sadda-db');
var MenuCategory = require("./../../food/MenuCategory");
var Menu = require("./../../food/Menu");

 describe("Menu category modal",function(){
    var menu_id ;
    before(function(done){
        db.connect(db.MODE_TEST, function(){
            db.dropTable("menu_categories", function(){
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
    describe("Adding new menu categories",function(){
        var error;
        var res = {};
        before(function(done){
            MenuCategory.addCategories({
                menu_id: menu_id,
                categories : ['Rice']
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
    describe("Finding for menu categories",function(){
        var error;
        var res;
        before(function(done){
            MenuCategory.addCategories({
                menu_id: menu_id,
                categories : ['Rice']
            },function(err,result){
                MenuCategory.findMenuCategory({menu_id:menu_id,category_id:result.result.RICE.category_id},function(err,result){
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
            assert.ok(res[0].category_name === 'RICE');
        });
    });
    describe("Updating menu category",function(){
        var error;
        var res;
        before(function(done){
            MenuCategory.addCategories({
                menu_id: menu_id,
                categories : ['Rice']
            },function(err,result){
                MenuCategory.updateCategory({menu_id:menu_id,category_id:result.result.RICE.category_id , updated_category_name:'pizza'},function(err,result){
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
            assert.ok(res[0].category_name === 'PIZZA');
        });
    });
    describe("Deleting menu category",function(){
        var error;
        var res;
        before(function(done){
            MenuCategory.addCategories({
                menu_id: menu_id,
                categories : ['Rice']
            },function(err,result){
                MenuCategory.deleteCategory({menu_id:menu_id,category_id:result.result.RICE.category_id},function(err,result){
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
		db.dropTable('menu_categories', function(){
			done();
		});
    });
    after(function(done){
        db.dropTable('menus', function(){
			done();
		});
    })
 })
