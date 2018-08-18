var assert = require('assert');
var db = require('./../../lib/sadda-db');
var Merchant = require('./../_Merchants');
var Business = require('./../_Business');
var error_message  = require('./../../config/error_messages');

describe("Business Info modal",function(){
    var merchant_id;
    before(function(done){
        db.connect(db.MODE_TEST, function(){
            db.dropTable("businesses", function(){
                done();
            });
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
            done();
        })
    })
    describe('Adding Business',function(){
        var error;
        var res;
        before(function(done){
            var value = {
                merchant_id: merchant_id,
                business_id: 'RDB',
                name: 'Rang De Basanti',
                type: 'restaurant',
                address: 'fadsfds'
            }
            Business.addBusiness(value,function(err,result){
                error = err;
                res = result;
                done();
            })
        })
        it("no error should be returned",function(){
            assert.ok(error == null);
        })
        it("cheking result business_id",function(){
            assert.ok(res.Business.business_id == 'RDB');
        })
        it("checking result name",function(){
            assert.ok(res.Business.name == "Rang De Basanti");
        })
        it("checking result type",function(){
            assert.ok(res.Business.type == "restaurant");
        })
    });
    describe('Adding Business without details',function(){
        var error;
        var res;
        before(function(done){
            var value = {};
            Business.addBusiness(value,function(err,result){
                error = err;
                res = result;
                done();
            })
        })
        it("error should be returned",function(){
            assert.ok(error.message == error_message.MISSING_PARAMETERS);
        })
        it("result should be null",function(){
            assert.ok(res == undefined);
        })
    });
    describe('Finding the Business',function(){
        var error;
        var res;
        before(function(done){
            var value = {
                merchant_id: merchant_id,
                business_id: 'RDB',
                name: 'Rang De Basanti',
                type: 'restaurant',
                address: 'fadsfds'
            }
            Business.addBusiness(value,function(err){
                if(err) throw err;
                var value = {
                    merchant_id : merchant_id,
                    business_id : 'RDB'
                }
                Business.findBusiness(value,function(err,result){
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
            assert.ok(res[0].business_id == 'RDB' )
        })
        it("cheking the result for name",function(){
            assert.ok(res[0].name == 'Rang De Basanti')
        })
    })
    describe('Update the restaurant',function(){
        var error;
        var res;
        before(function(done){
            var value = {
                merchant_id: merchant_id,
                business_id: 'RDB',
                name: 'Rang De Basanti',
                type: 'restaurant',
                address: 'fadsfds'
            }
            Business.addBusiness(value,function(err){
                if(err) throw err;
                var args_old = {
                    merchant_id : merchant_id,
                    business_id : "RDB"
                };
                var args_update = {
                    name : "Taste Of Asia",
                    business_id : 'TOA'
                }
                Business.updateBusiness({args_update:args_update,args_old:args_old},function(err,result){
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
        it("cheking the result for name",function(){
            assert.ok(res[0].name == "Taste Of Asia")
        })
        it("cheking the result for business_id",function(){
            assert.ok(res[0].business_id == "TOA")
        })
    });
    describe('Delete the restaurant',function(){
        var error;
        var res;
        before(function(done){
            var value = {
                merchant_id: merchant_id,
                business_id: 'RDB',
                name: 'Rang De Basanti',
                type: 'restaurant',
                address: 'fadsfds'
            }
            Business.addBusiness(value,function(err){
                if(err) throw err;
                var value = {
                    merchant_id : merchant_id,
                    business_id : 'RDB'
                };
                Business.deleteBusiness(value,function(err,result){
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
		db.dropTable('businesses', function(){
			done();
		});
    });
    after(function(done){
        db.dropTable('merchants', function(){
			done();
		});
    })
    after(function(done){
        db.dropTable('businesses', function(){
			done();
		});
    });
});