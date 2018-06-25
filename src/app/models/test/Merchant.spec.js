var assert = require('assert');
var Merchant = require('../Merchant');
var error_messages = require('../../config/error_messages');
var db = require('../../lib/sadda-db');

describe('Merchant - model', function(){
	before(function(done){
		db.connect(db.MODE_TEST, function(){
			db.dropTable(db.tables.merchants.name, function(){
				done();
			});
		});
	});

	describe('Create Merchant', function(){
		describe('When correct credentials is provided', function(){
			var error, result;
			before(function(done){
				Merchant.create({
					name: 'devesh',
					email: 'ananddevesh22@gmail.com',
					password:'123456',
					country_code: '+91',
					number: '7541833368',
					alternate_country_code: '+91',
					alternate_number: '1478523698'
				}, function(err, res){
					error = err;
					result = res;
					done();
				});
			});

			it('returns with no error', function(){
				assert.ok(!error);
			});
			it('returns Merchant object', function(){
				assert.ok(result.Merchant !== null);
			});
			it('Merchant object has merchant_id', function(){
				assert.ok(result.Merchant.merchant_id !== null);
			});
			it('Merchant object has name', function(){
				assert.ok(result.Merchant.name !== null);
			});
			it('Merchant object has email', function(){
				assert.ok(result.Merchant.email !== null);
			});
			it('Merchant object has country_code', function(){
				assert.ok(result.Merchant.country_code !== null);
			});
			it('Merchant object has number', function(){
				assert.ok(result.Merchant.number !== null);
			});
			it('Merchant object has alternate_country_code', function(){
				assert.ok(result.Merchant.alternate_country_code !== null);
			});
			it('Merchant object has alternate_number', function(){
				assert.ok(result.Merchant.alternate_number !== null);
			});
			it('Merchant object has status', function(){
				assert.ok(result.Merchant.status !== null);
			});
		});
		describe('Returns callback with error and sets the correct error messages when...', function(){
			it('length of name is less than 6', function(done){
				Merchant.create({name: 'moha'}, function(err){
					assert.ok(err && err.message == error_messages.INVALID_NAME, err.message);
					done();
				});
			});
			it('name is missing', function(done){
				Merchant.create({}, function(err){
					assert.ok(err && err.message == error_messages.INVALID_NAME, err.message);
					done();
				});
			});
			it('invalid email is provided', function(done){
				Merchant.create({name: 'mohan', email: 'a@a'}, function(err){
					assert.ok(err && err.message == error_messages.INVALID_EMAIL, err.message);
					done();
				});
			});
			it('length of password is less than 6', function(done){
				Merchant.create({name: 'mohan', email: 'aasdf@fas.com', password:'12345'}, function(err){
					assert.ok(err && err.message == error_messages.INVALID_PASSWORD, err.message);
					done();
				});
			});
			it('merchant with email exists', function(done){
				Merchant.create({
					name: 'devesh',
					email: 'ananddevesh22@gmail.com',
					password:'123456',
					country_code: '+91',
					number: '7541833368',
					alternate_country_code: '+91',
					alternate_number: '1478523698'
				}, function(){
					Merchant.create({
						name: 'mohan',
						email: 'ananddevesh22@gmail.com',
						password:'123456',
						country_code: '+91',
						number: '1234567890',
						alternate_country_code: '+91',
						alternate_number: '1478523698'
					}, function(err){
						assert.ok(err, err.message == error_messages.DUPLICATE_MERCHANT, err.message);
						done();
					});
				});
			});
			it('merchant with number exists', function(done){
				Merchant.create({
					name: 'devesh',
					email: 'ananddeve2@gmail.com',
					password:'123456',
					country_code: '+91',
					number: '7541833368',
					alternate_country_code: '+91',
					alternate_number: '1478523698'
				}, function(){
					Merchant.create({
						name: 'mohan',
						email: 'ananddevesh22@gmail.com',
						password:'123456',
						country_code: '+91',
						number: '7541833368',
						alternate_country_code: '+91',
						alternate_number: '1478523698'
					}, function(err){
						assert.ok(err, err.message == error_messages.DUPLICATE_MERCHANT, err.message);
						done();
					});
				});
			});
			it('invalid country_code is provided', function(done){
				Merchant.create({
					name: 'mohan',
					email: 'aasdf@fas.com',
					password:'123456',
					country_code: 'asdf'
				}, function(err){
					assert.ok(err && err.message == error_messages.INVALID_COUNTRY_CODE, err.message);
					done();
				});
			});
			it('invalid number is provided', function(done){
				Merchant.create({
					name: 'mohan',
					email: 'aasdf@fas.com',
					password:'123456',
					country_code: '+91',
					number: '4324'
				}, function(err){
					assert.ok(err && err.message == error_messages.INVALID_MOBILE_NUMBER, err.message);
					done();
				});
			});
			it('invalid alternate_country_code is provided', function(done){
				Merchant.create({
					name: 'mohan',
					email: 'aasdf@fas.com',
					password:'123456',
					country_code: '+91',
					number: '1234567890',
					alternate_country_code: 'asdf'
				}, function(err){
					assert.ok(err && err.message == error_messages.INVALID_COUNTRY_CODE, err.message);
					done();
				});
			});
			it('invalid alternate_number is provided', function(done){
				Merchant.create({
					name: 'mohan',
					email: 'aasdf@fas.com',
					password:'123456',
					country_code: '+91',
					number: '1234567890',
					alternate_country_code: '+91',
					alternate_number: '1564'
				}, function(err){
					assert.ok(err && err.message == error_messages.INVALID_MOBILE_NUMBER, err.message);
					done();
				});
			});
			it('when mobile number and alternate mobile number are same');

		});
	});

	describe('Find Merchant by email', function(){
        describe('Valid email is provided and merchant exists', function(){
            var args ;
            var result;
            var error;
            before(function(done){
                args = {
					name: 'devesh',
					email: 'ananddevesh22@gmail.com',
					password:'123456',
					country_code: '+91',
					number: '7541833368',
					alternate_country_code: '+91',
					alternate_number: '1478523698'
                }
                Merchant.create(args, function(err){
                    if(err)
                        throw err;
                    Merchant.findByEmail({
                        email: 'ananddevesh22@gmail.com',
                    }, function(err, res){
                        error = err;
                        result = res;
                        done();
                    });
                });
            });
            it('returns with no error', function(){
				assert.ok(!error);
			});
			it('returns Merchant object', function(){
				assert.ok(result.Merchant !== null);
			});
			it('Merchant object has merchant_id', function(){
				assert.ok(result.Merchant.merchant_id !== null);
			});
			it('Merchant object has name', function(){
				assert.ok(result.Merchant.name !== null);
			});
			it('Merchant object has email', function(){
				assert.ok(result.Merchant.email !== null);
			});
			it('Merchant object has country_code', function(){
				assert.ok(result.Merchant.country_code !== null);
			});
			it('Merchant object has number', function(){
				assert.ok(result.Merchant.number !== null);
			});
			it('Merchant object has alternate_country_code', function(){
				assert.ok(result.Merchant.alternate_country_code !== null);
			});
			it('Merchant object has alternate_number', function(){
				assert.ok(result.Merchant.alternate_number !== null);
			});
			it('Merchant object has status', function(){
				assert.ok(result.Merchant.status !== null);
			});
        });

        describe('callback returns with error when ...', function(){
            it('email is missing', function(done){
                Merchant.findByEmail({
                }, function(err){
                    assert.ok(err && err.message == error_messages.INVALID_EMAIL);
                    done();
                });
            });
            it('invalid email is provided',function(done){
                Merchant.findByEmail({
                    email: 'a@a',
                }, function(err){
                    assert.ok(err && err.message == error_messages.INVALID_EMAIL);
                    done();
                });
            });
        });

        describe('When merchant does not exist', function(){
            before(function(done){
                db.drop([db.tables.merchants.name], function(){done()});
            });
            it('empty Merchant object is returned', function(done){
                Merchant.findByEmail({
                    email: 'ananddevesh22@gmail.com',
                }, function(err, result){
                    assert.ok(!result.Merchant);``
                    done();
                });
            });
        });
	});


	afterEach(function(done){
		db.dropTable(db.tables.merchants.name, function(){
			done();
		});
	});

	after(function(done){
		db.end();
		done();
	});

});
