var Business = require('../Business');
var Merchant = require('../Merchant');
var assert = require('assert');
var error_messages = require('../../config/error_messages');
var db = require('../../lib/sadda-db');

var testSetup = function(callback){
	Merchant.create({
		name: 'devesh',
		email: 'ananddev2@gmail.com',
		password:'devdas23',
		country_code: '+91',
		number: '7541833389',
		alternate_country_code: '+91',
		alternate_number: '1478523698'
	}, function(e, r){
		if(e)throw(e);
		Business.create({
			merchant_id: r.Merchant.merchant_id,
			business_id: 'RDB',
			name: 'Rang De Basanti',
			type: Business.types.restaurant,
			address: 'fadsfds'
		},function(e,r){
			if(e)throw(e);
			callback(e,r);
		});
	});
}

describe('Business-model',function(){
	before(function(done){
		db.connect(db.MODE_TEST, function(){
			db.dropTable(db.tables.businesses.name, function(){
				done();
			});
		});
	});
	describe('Create', function(){
		describe('When correct parameters are provided', function(){
			var err, res;
			before(function(done){
				testSetup(function(error, result){
					err = error;
					res = result;
					done();
				});
			});
			it('error is set to null',function(){
				assert.ok(err === null, err);
			});
			it('Business object is returned',function(){
				assert.ok(res.Business !== null, err);
			});
			it('Business object contains merchant_id',function(){
				assert.ok(res.Business.merchant_id, err);
			});
			it('Business object containes business_id',function(){
				assert.ok(res.Business.business_id !== null, err);
			});
			it('Business object containes name',function(){
				assert.ok(res.Business.name !== null, err);
			});
			it('Business object containes address',function(){
				assert.ok(res.Business.address !== null, err);
			});
			it('Business object containes type',function(){
				assert.ok(res.Business.type !== null, err);
			});
			it('Business object containes status',function(){
				assert.ok(res.Business.status !== null, err);
			});
			it('status is set to disabled',function(){
				assert.ok(res.Business.status == Business.status.disabled, err);
			});
			after(function(done){
				db.dropTable(db.tables.merchants.name, function(){
					done();
				});
			});
		});
		describe('When duplicate business exists', function(){
			var err;
			before(function(done){
				testSetup(function(error, result){
					Business.create({
						merchant_id: result.Business.merchant_id,
						business_id: 'RDB',
						name: 'Rang De Basanti',
						type: Business.types.restaurant,
						address: 'fadsfds'
					},function(error){
						err = error;
						done();
					});
				});
			});
			it('return with error',function(){
				assert.ok(err);
			});
			it('correct error message is set',function(){
				assert.ok(err.message === error_messages.DUPLICATE_BUSINESS);
			});
			after(function(done){
				db.dropTable(db.tables.merchants.name, function(){
					done();
				});
			});
		});
		describe('Returns callback with error and sets the correct error messages when...', function(){
			it('merchant_id is not provided',function(done){
				Business.create({
					business_id: 'abc'
				},function(err){
					assert.ok(err && err.message == error_messages.MISSING_PARAMETERS);
					done();
				});
			});
			it('business_id is not provided',function(done){
				Business.create({
					merchant_id: 'asdfas'
				},function(err){
					assert.ok(err && err.message == error_messages.MISSING_PARAMETERS, err.message);
					done();
				});
			});
			it('invalid business_id is provided',function(done){
				Business.create({
					merchant_id: 'asdfas',
					business_id: 'as',
					name: 'fasdf',
					type: Business.types.restaurant,
					address: 'fsdfds'
				},function(err){
					assert.ok(err && err.message == error_messages.INVALID_BUSINESS_ID, err.message);
					done();
				});
			});
			it('name is not provided',function(done){
				Business.create({
					merchant_id: 'asdfas',
					business_id: 'as',
					type: Business.types.restaurant
				},function(err){
					assert.ok(err && err.message == error_messages.MISSING_PARAMETERS, err.message);
					done();
				});
			});
			it('type is not provided',function(done){
				Business.create({
					merchant_id: 'asdfas',
					business_id: 'as',
					name: 'name'
				},function(err){
					assert.ok(err && err.message == error_messages.MISSING_PARAMETERS, err.message);
					done();
				});
			});
			it('address is not provided',function(done){
				Business.create({
					merchant_id: 'asdfas',
					business_id: 'asf',
					name: 'name',
					type: Business.types.restaurant
				},function(err){
					assert.ok(err && err.message == error_messages.MISSING_PARAMETERS, err.message);
					done();
				});
			});
			it('invalid type is provided',function(done){
				Business.create({
					merchant_id: 'asdfas',
					business_id: 'avs',
					name: 'name',
					type: 'test',
					address: 'afasdfsd'
				},function(err){
					assert.ok(err && err.message == error_messages.INVALID_BUSINESS_TYPE, err.message);
					done();
				});
			});
		});
	});
	describe('find by id', function(){
		describe('When correct parameters are provided and business exists', function(){
			var err, res;
			before(function(done){
				testSetup(function(error, result){
					Business.findById({
						merchant_id: result.Business.merchant_id,
						business_id: 'RDB'
					},function(error, result){
						err = error;
						res = result;
						done();
					});
				});
			});
			it('error is set to null',function(){
				assert.ok(err === null);
			});
			it('Business object is returned',function(){
				assert.ok(res.Business !== null, err);
			});
			it('Business object contains merchant_id',function(){
				assert.ok(res.Business.merchant_id, err);
			});
			it('Business object containes business_id',function(){
				assert.ok(res.Business.business_id !== null, err);
			});
			it('Business object containes name',function(){
				assert.ok(res.Business.name !== null, err);
			});
			it('Business object containes address',function(){
				assert.ok(res.Business.address !== null, err);
			});
			it('Business object containes type',function(){
				assert.ok(res.Business.type !== null, err);
			});
			it('Business object containes status',function(){
				assert.ok(res.Business.status !== null, err);
			});
			after(function(done){
				db.dropTable(db.tables.merchants.name, function(){
					done();
				});
			});
		});
		describe('callback returns with error when ...',function(){
			it('merchant_id is not provided',function(done){
				Business.findById({
					business_id: 'abc'
				},function(err){
					assert.ok(err && err.message == error_messages.MISSING_PARAMETERS);
					done();
				});
			});
			it('business_id is not provided',function(done){
				Business.findById({
					merchant_id: 'abc'
				},function(err){
					assert.ok(err && err.message == error_messages.MISSING_PARAMETERS);
					done();
				});
			});
			it('invalid business_id is provided',function(done){
				Business.findById({
					merchant_id: 'adfsadsfasdf',
					business_id: 'ab'
				},function(err){
					assert.ok(err && err.message == error_messages.INVALID_BUSINESS_ID);
					done();
				});
			});
		});
		describe('When business does not exist', function(){
			it('err is set to null', function(done){
				Business.findById({
					merchant_id: 'adfsadsfasdf',
					business_id: 'abc'
				},function(err){
					assert.ok(err === null);
					done();
				});
			});
			it('result contains empty Business object', function(done){
				Business.findById({
					merchant_id: 'adfsadsfasdf',
					business_id: 'abc'
				},function(err, res){
					assert.ok(!res.Business);
					done();
				});
			});
		});
	});
	describe('Disable business', function(){
		describe('When valid merchant_id and business_id is provided', function(){
			var err,res;
			before(function(done){
				testSetup(function(error, result){
					Business.disable({
						merchant_id: result.Business.merchant_id,
						business_id: 'RDB'
					},function(error, result){
						err = error;
						res = result;
						done();
					});
				});
			});
			it('error should be null',function(){
				assert.ok(err === null);
			});
			it('Business object should be returned', function(){
				assert.ok(res.Business !== null);
			});
			it('status of business should be disabled', function(){
				assert.ok(res.Business.status === Business.status.disabled);
			});
		});
		describe('When no merchant_id provided',function(){
			var err;
			before(function(done){
				Merchant.disable({}, function(error){
					err = error;
					done();
				});
			});
			it('error is returned',function(){
				assert.ok(err!==null);
			});
			it('correct error message is set',function(){
				assert.ok(err.message === error_messages.MISSING_PARAMETERS);
			});
		});
		describe('When business does not exist',function(){
			var err;
			before(function(done){
				Merchant.disable({merchant_id: 'dafasdfasdfasd',business_id:'fas'}, function(error){
					err = error;
					done();
				});
			});
			it('error is returned',function(){
				assert.ok(err!==null);
			});
			it('correct error message is set',function(){
				assert.ok(err.message === error_messages.MERCHANT_DOES_NOT_EXIST, err.message);
			});
		});
	});

	describe('Enable business', function(){
		describe('When valid merchant_id is provided', function(){
			var err,res;
			before(function(done){
				testSetup(function(error, result){
					Business.enable({
						merchant_id: result.Business.merchant_id,
						business_id: 'RDB'
					},function(error, result){
						err = error;
						res = result;
						done();
					});
				});
			});
			it('error should be null',function(){
				assert.ok(err === null);
			});
			it('Business object should be returned', function(){
				assert.ok(res.Business !== null);
			});
			it('status of business should be enabled', function(){
				assert.ok(res.Business.status === Business.status.active);
			});
		});
		describe('When no merchant_id provided',function(){
			var err;
			before(function(done){
				Merchant.enable({}, function(error){
					err = error;
					done();
				});
			});
			it('error is returned',function(){
				assert.ok(err!==null);
			});
			it('correct error message is set',function(){
				assert.ok(err.message === error_messages.MISSING_PARAMETERS);
			});
		});
		describe('When merchant with merchant_id does not exist',function(){
			var err;
			before(function(done){
				Merchant.enable({merchant_id: 'dafasdfasdfasd'}, function(error){
					err = error;
					done();
				});
			});
			it('error is returned',function(){
				assert.ok(err!==null);
			});
			it('correct error message is set',function(){
				assert.ok(err.message === error_messages.MERCHANT_DOES_NOT_EXIST, err.message);
			});
		});
	});
	describe('Delete business', function(){
		describe('When valid parameters are provided and business exists',function(){
			var err, res;
			before(function(done){
				testSetup(function(error, result){
					res = result;
					Business.delete({
						merchant_id: result.Business.merchant_id,
						business_id: result.Business.business_id
					},function(error){
						err = error;
						done();
					});
				});
			});
			it('error is set to null',function(){
				assert.ok(err === null);
			});
			it('deletes the business from the database',function(done){
				Business.findById({
					merchant_id: res.Business.merchant_id,
					business_id: res.Business.business_id
				},function(err, res){
					if(err)throw(err);
					assert.ok(res.Business === undefined);
					done();
				});
			});
		});

	});
	describe('find all by merchant id', function(){
		var merchant_id_test;
		before(function(done){
			testSetup(function(error,result){
				merchant_id_test = result.Business.merchant_id;
				Business.create({
					merchant_id: merchant_id_test,
					business_id: 'LPZ',
					name: 'La Piazza',
					type: Business.types.restaurant,
					address: 'fsdfd'
				},function(e){
					if(e)throw(e);
					done();
				});
			});
		});
		describe('When valid merchant_id is provided and businesses exist', function(){
			var err,res;
			before(function(done){
				Business.getAllByMerchantId({merchant_id:merchant_id_test},function(error,result){
					err = error;
					res = result;
					done();
				});
			});
			it('error should be set to null',function(){
				assert.ok(err === null);
			});
			it('res object should contain businesses object',function(){
				assert.ok(res.Businesses);
			});
			it('length of businesses array should be 2',function(){
				assert.ok(res.Businesses.length === 2);
			});
		})
		describe('When merchant id is not provided', function(){
			var err;
			before(function(done){
				Business.getAllByMerchantId({}, function(error){
					err = error;
					done();
				});
			});
			it('error should not be null',function(){
				assert.ok(err);
			});
			it('correct error message should be set',function(){
				assert.ok(err.message === error_messages.MISSING_PARAMETERS);
			});
		});
		describe('When merchant with correspondin merchant_id does not exist', function(){
			var err;
			before(function(done){
				Business.getAllByMerchantId({merchant_id: 'fsadfadsfdsf'}, function(error){
					err = error;
					done();
				});
			});
			it('error should not be null',function(){
				assert.ok(err);
			});
			it('correct error message should be set',function(){
				assert.ok(err.message === error_messages.MERCHANT_DOES_NOT_EXIST);
			});
		});
	});
	afterEach(function(done){
		db.dropTable(db.tables.merchants.name, function(){
			done();
		});
	});
	after(function(done){
		db.dropTable(db.tables.merchants.name, function(){
			db.end();
			done();
		});
	});
});

