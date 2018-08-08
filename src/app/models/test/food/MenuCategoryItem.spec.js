var assert = require('assert');
var db = require('./../../../lib/sadda-db');
var MenuCategoryItem = require("./../../food/MenuCategoryItems");
var Menu = require("./../../food/Menu");
var MenuCategory = require('./../../food/MenuCategory');

 describe("Menu category Items modal",function(){
    var menu_id ;
    var category_id;
    before(function(done){
        db.connect(db.MODE_TEST, function(){
            db.dropTable("menu_category_items", function(){
                done();
            });
        });
    });
    before(function(done){
        Menu.addMenu({description:'test'},function(err,res){
            if(err)throw err;
            menu_id = res.Menus.menu_id;
            MenuCategory.addCategories({
                menu_id: menu_id,
                categories : ['Rice']
            },function(err,result){
                category_id = result.result.RICE.category_id;
                done();
            });
        });
    });
    describe("Adding new menu categories items",function(){
        var error;
        var res = {};
        before(function(done){
            MenuCategoryItem.addCategoryItems({
                menu_id: menu_id,
                category_id: category_id,
                category_items : [
                    {
                        name : 'Fried Rice',
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
            MenuCategoryItem.addCategoryItems({
                menu_id: menu_id,
                category_id: category_id,
                category_items : [
                    {
                        name : 'Fried_Rice',
                        price : 140 
                    }
                ]
            },function(err,result){
                MenuCategoryItem.findCategoryItems({menu_id : menu_id , category_id : category_id , item_id : result.result.FRIED_RICE.item_id},function(err,result){
                    error = err;
                    res = result;
                    done();
                });
            });
        });
        it("error should be null",function(){
            assert.ok(error === null);
        });
        it("checking the name in result",function(){
            assert.ok(res[0].name === 'FRIED_RICE');
        });
        it("checking category_id in result",function(){
            assert.ok(res[0].category_id === category_id);
        })
    });
    describe("Updating menu category",function(){
        var error;
        var res;
        before(function(done){
            MenuCategoryItem.addCategoryItems({
                menu_id: menu_id,
                category_id: category_id,
                category_items : [
                    {
                        name : 'Fried_Rice',
                        price : 140 
                    }
                ]
            },function(err,result){
                MenuCategoryItem.updateCategoryItem({
                    menu_id : menu_id,
                    category_id : category_id,
                    item_id : result.result.FRIED_RICE.item_id,
                    updates:{
                        name: 'Steamed_Rice',
                        price : 800
                    }},function(err,result){
                    error = err;
                    res = result;
                    done();
                });
            });
        });
        it("error should be null",function(){
            assert.ok(error === null);
        });
        it("checking the name in result",function(){
            assert.ok(res[0].name === 'Steamed_Rice');
        });
        it("checking the price in result",function(){
            assert.ok(res[0].price === 800);
        });
    });
    describe("Deleting menu category",function(){
        var error;
        var res;
        before(function(done){
            MenuCategoryItem.addCategoryItems({
                menu_id: menu_id,
                category_id: category_id,
                category_items : [
                    {
                        name : 'Fried_Rice',
                        price : 140 
                    }
                ]
            },function(err,result){
                MenuCategoryItem.deleteCategoryItem({
                    menu_id : menu_id,
                    category_id : category_id,
                    item_id : result.result.FRIED_RICE.item_id
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
        it("checking the no of affected rows",function(){
            assert.ok(res.affectedRows === 1);
        });
    });
    afterEach(function(done){
		db.dropTable('menu_category_items', function(){
			done();
		});
    });
    after(function(done){
        db.dropTable('menu_categories',function(){
            done();
        });
    });
    after(function(done){
        db.dropTable('menus', function(){
			done();
		});
    })
 })
