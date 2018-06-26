var assert = require('assert');
var Onboarding = require('../processes/onboarding');
var db = require('../../../app/lib/sadda-db');
var error_messages = require('../../../app/config/error_messages');

describe('New Merchant onboarding', function(){
	before(function(done){
		db.connect(db.MODE_TEST, function(){
			db.dropTable(db.tables.merchants.name, function(){
				done();
			});
		});
	});
	describe('When valid arguments is provided', function(){
        var error, response;
        before(function(done){
            var MerchantOnboarding = new Onboarding({
				name: 'devesh',
				email: 'ananddevesh22@gmail.com',
				password:'123456',
				country_code: '+91',
				number: '7541833368',
				alternate_country_code: '+91',
				alternate_number: '1478523698'
			});
			MerchantOnboarding.createMerchant(function(err, res){
				error = err;
				response = res;
				done();
			});
        });
        it('callback returns with no error', function(){
            assert.ok(!error);
        });
        it('callback returns with Merchant object', function(){
            assert.ok(response.Merchant);
        });
        it('Merchant object has merchant_id', function(){
			assert.ok(response.Merchant.merchant_id !== null);
		});
		it('Merchant object has name', function(){
			assert.ok(response.Merchant.name !== null);
		});
		it('Merchant object has email', function(){
			assert.ok(response.Merchant.email !== null);
		});
		it('Merchant object has country_code', function(){
			assert.ok(response.Merchant.country_code !== null);
		});
		it('Merchant object has number', function(){
			assert.ok(response.Merchant.number !== null);
		});
		it('Merchant object has alternate_country_code', function(){
			assert.ok(response.Merchant.alternate_country_code !== null);
		});
		it('Merchant object has alternate_number', function(){
			assert.ok(response.Merchant.alternate_number !== null);
		});
		it('Merchant object has status', function(){
			assert.ok(response.Merchant.status !== null);
		});
	});
	describe('Sad path', function(){
		describe('When invalid name is provided', function(){
            var error, response;
            before(function(done){
                var MerchantOnboarding = new Onboarding({
					name: 'dev',
					email: 'ananddevesh22@gmail.com',
					password:'123456',
					country_code: '+91',
					number: '7541833368',
					alternate_country_code: '+91',
					alternate_number: '1478523698'
				});
				MerchantOnboarding.createMerchant(function(err, res){
					error = err;
					response = res;
					done();
				});
			});
			it('error should be null', function(){
				assert.ok(error === null);
			});
            it('returns success = false', function(){
                assert.ok(response.success === false);
            });
            it('sets correct error message', function(){
                assert.ok(response.message == error_messages.INVALID_NAME);
            });

		});
		describe('When invalid email is provided', function(){
            var error, response;
            before(function(done){
                var MerchantOnboarding = new Onboarding({
					name: 'devesh',
					email: 'ananddevesh22gmail.com',
					password:'123456',
					country_code: '+91',
					number: '7541833368',
					alternate_country_code: '+91',
					alternate_number: '1478523698'
				});
				MerchantOnboarding.createMerchant(function(err, res){
					error = err;
					response = res;
					done();
				});
			});
			it('error should be null', function(){
				assert.ok(error === null);
			});
            it('returns success = false', function(){
                assert.ok(response.success === false);
            });
            it('sets correct error message', function(){
                assert.ok(response.message == error_messages.INVALID_EMAIL);
            });

		});
	});
	after(function(done){
		db.dropTable(db.tables.merchants.name, function(){
			db.end();
			done();
		});
	})
});


