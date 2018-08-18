var assert = require('assert');
var db = require('./../../lib/sadda-db');
var Merchant = require('./../_Merchants');
var error_message  = require('./../../config/error_messages');

describe("Restaurant Info modal",function(){
    before(function(done){
        db.connect(db.MODE_TEST, function(){
            db.dropTable("merchants", function(){
                done();
            });
        });
    });
    describe('Adding merchant',function(){
        var error;
        var res;
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
                error = err;
                res = result;
                done();
            })
        })
        it("no error should be returned",function(){
            assert.ok(error == null);
        })
        it("Merchant id in result",function(){
            assert.ok(res.Merchant.merchant_id);
        })
        it("name in result",function(){
            assert.ok(res.Merchant.name == "devesh");
        })        
        it("email in result",function(){
            assert.ok(res.Merchant.email == "ananddevesh22@gmail.com");
        })        
        it("number in result",function(){
            assert.ok(res.Merchant.number == "7541833368");
        })
    });
    describe('Adding merchant without details',function(){
        var error;
        var res;
        before(function(done){
            var value = {}
            Merchant.addMerchant(value,function(err,result){
                error = err;
                res = result;
                done();
            })
        })
        it("error should be returned",function(){
            assert.ok(error.message == error_message.MISSING_PARAMETERS);
        })
        it("Result should be undefined",function(){
            assert.ok(res == undefined)
        })
    });
    describe('Finding the merchant',function(){
        var error;
        var res;
        var merchant_id;
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
                merchant_id = result.Merchant.merchant_id;
                Merchant.findMerchant({merchant_id : result.Merchant.merchant_id} , function(){
                    error = err;
                    res = result;
                    done();
                })
            })
        })
        it("error should be null",function(){
            assert.ok(error == null);
        })
        it("cheking the result for merchant_id",function(){
            assert.ok(res.Merchant.merchant_id == merchant_id)
        })
        it("cheking the result for name",function(){
            assert.ok(res.Merchant.name == 'devesh')
        })
        it("cheking the result for email",function(){
            assert.ok(res.Merchant.email == 'ananddevesh22@gmail.com')
        })
    });
    describe('Update the merchant',function(){
        var error;
        var res;
        var merchant_id;
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
                merchant_id = result.Merchant.merchant_id;
                var args_old = {
                    merchant_id : result.Merchant.merchant_id
                };
                var args_update = {
                    name : "Akash",
                    email : "akashagarwal0403@gmail.com"
                }
                Merchant.updateMerchant({args_update:args_update,args_old:args_old},function(err,result){
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
            assert.ok(res[0].name == "Akash")
        })
        it("cheking the result for email",function(){
            assert.ok(res[0].email == "akashagarwal0403@gmail.com")
        })
    });
    describe('Delete the restaurant',function(){
        var error;
        var res;
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
                var value = {
                    merchant_id : result.Merchant.merchant_id
                }
                Merchant.deleteMerchant(value,function(err,result){
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
		db.dropTable('merchants', function(){
			done();
		});
    });
});