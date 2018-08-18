var assert = require('assert');
var db = require('./../../lib/sadda-db');
var Restaurant = require("./../Restraunt_info");
var Menu = require("./../food/Menu");
var Merchant = require('./../_Merchants');
var Business = require('./../_Business');
var error_message  = require('./../../config/error_messages');

describe("Restaurant Info modal",function(){
    var menu_id ;
    var merchant_id;
    var business_id;
    before(function(done){
        db.connect(db.MODE_TEST, function(){
            db.dropTable("restaurant_info", function(){
                done();
            });
        });
    });
    before(function(done){
        Menu.addMenu({description:"this is for testing"},function(err,result){
            if(err) throw err;
            menu_id = result.Menus.menu_id;
            done();
        });
    });
    before(function(done){
        var value = {
            name: 'devesh',
			email: 'ananddevesh22@gmail.com',
			password:'devdas23',
			country_code: '+91',
			number: '7541833368',
			alternate_country_code: '+91',
			alternate_number: '1478523698'
        }
        Merchant.addMerchant(value,function(err,result){
            if(err) throw err;
            merchant_id = result.Merchant.merchant_id
            value = {
                merchant_id: merchant_id,
                business_id: 'RDB',
                name: 'Rang De Basanti',
                type: 'restaurant',
                address: 'fadsfds'
            }
            Business.addBusiness(value,function(err,result){
                if(err) throw err;
                business_id = result.Business.business_id;
                done();
            })
        })
    })
    describe('Adding restaurant info',function(){
        var error;
        var res;
        before(function(done){
            var value = {
                merchant_id : merchant_id,
                business_id : business_id,
                menu_id : menu_id,
                speciality : "Food",
                status : "open"
            }
            Restaurant.addRestaurant(value,function(err,result){
                error = err;
                res = result;
                done();
            })
        })
        it("no error should be returned",function(){
            assert.ok(error == null);
        })
        it("cheking result menu_id",function(){
            assert.ok(res.Restaurant.menu_id == menu_id);
        })
        it("checking result speciality",function(){
            assert.ok(res.Restaurant.speciality == "Food");
        })
        it("checking result status",function(){
            assert.ok(res.Restaurant.status == "open");
        })
    });
    describe('Adding restaurant info without menu_id',function(){
        var error;
        var res;
        before(function(done){
            var value = {
                merchant_id : merchant_id,
                business_id : business_id,
            }
            Restaurant.addRestaurant(value,function(err,result){
                error = err;
                res = result;
                done();
            })
        })
        it("error should be returned",function(){
            assert.ok(error.message == error_message.MISSING_PARAMETERS);
        })
        it("result should be undefined",function(){
            assert.ok(res  == undefined);
        })
    });
    describe('Adding restaurant with wrong merchant_id',function(){
        var error;
        var res;
        before(function(done){
            var value = {
                merchant_id : 'cxdfcx',
                business_id : business_id,
                menu_id : menu_id
            }
            Restaurant.addRestaurant(value,function(err,result){
                error = err;
                res = result;
                done();
            })
        })
        it("error should be returned",function(){
            assert.ok(error.message);
        })
        it("result should be undefined",function(){
            assert.ok(res  == undefined);
        })
    });
    describe('Adding restaurant with wrong business_id',function(){
        var error;
        var res;
        before(function(done){
            var value = {
                merchant_id : merchant_id,
                business_id : 'dfsdfdzs',
                menu_id : menu_id
            }
            Restaurant.addRestaurant(value,function(err,result){
                error = err;
                res = result;
                done();
            })
        })
        it("error should be returned",function(){
            assert.ok(error.message);
        })
        it("result should be undefined",function(){
            assert.ok(res  == undefined);
        })
    });
    describe('Finding the restaurant',function(){
        var error;
        var res;
        before(function(done){
            var value = {
                merchant_id : merchant_id,
                business_id : business_id,
                menu_id : menu_id,
                speciality : "Food",
                status : "open"
            }
            Restaurant.addRestaurant(value,function(err){
                if(err) throw err;
                var value = {
                    merchant_id : merchant_id,
                    business_id : business_id
                }
                Restaurant.findRestaurant(value,function(err,result){
                    error = err;
                    res = result;
                    done();
                })
            });
        });
        it("error should be null",function(){
            assert.ok(error == null);
        })
        it("cheking the result for merchant_id",function(){
            assert.ok(res[0].merchant_id == merchant_id)
        })
        it("cheking the result for business_id",function(){
            assert.ok(res[0].business_id == business_id)
        })
        it("cheking the result for menu_id",function(){
            assert.ok(res[0].menu_id == menu_id)
        })
    })
    describe('Update the restaurant',function(){
        var error;
        var res;
        before(function(done){
            var value = {
                merchant_id : merchant_id,
                business_id : business_id,
                menu_id : menu_id,
                speciality : "Food",
                status : "open"
            }
            Restaurant.addRestaurant(value,function(err){
                if(err) throw err;
                var args_old = {
                    merchant_id : merchant_id,
                    business_id : business_id,
                    menu_id : menu_id
                };
                var args_update = {
                    speciality : "Updated",
                    status : "closed"
                }
                Restaurant.updateRestaurant({args_update:args_update,args_old:args_old},function(err,result){
                    error = err;
                    res = result;
                    done();
                })
            });
        });
        it("error should be null",function(){
            assert.ok(error == null);
        })
        it("cheking the result for merchant_id",function(){
            assert.ok(res[0].merchant_id == merchant_id)
        })
        it("cheking the result for speciality",function(){
            assert.ok(res[0].speciality == "Updated")
        })
        it("cheking the result for menu_id",function(){
            assert.ok(res[0].status == "closed")
        })
    });
    describe('Delete the restaurant',function(){
        var error;
        var res;
        before(function(done){
            var value = {
                merchant_id : merchant_id,
                business_id : business_id,
                menu_id : menu_id,
                speciality : "Food",
                status : "open"
            }
            Restaurant.addRestaurant(value,function(err){
                if(err) throw err;
                var value = {
                    merchant_id : merchant_id,
                    business_id : business_id,
                    menu_id : menu_id
                };
                Restaurant.deleteRestaurant(value,function(err,result){
                    error = err;
                    res = result;
                    done();
                })
            });
        });
        it("error should be null",function(){
            assert.ok(error == null);
        })
        it("checking affected Rows",function(){
            assert.ok(res.affectedRows == 1);
        })
    });
    afterEach(function(done){
		db.dropTable('restaurant_info', function(){
			done();
		});
    });
    after(function(done){
        db.dropTable('menus', function(){
			done();
		});
    })
    after(function(done){
        db.dropTable('merchants', function(){
			done();
		});
    })
    after(function(done){
        db.dropTable('businesses', function(){
			done();
		});
    })
});