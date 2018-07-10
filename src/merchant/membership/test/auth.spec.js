var sinon = require('sinon');
var assert = require('assert');
var Auth = require('../processes/auth');
var error_messages = require('../../../app/config/error_messages');
var db = require('../../../app/lib/sadda-db');
var Merchant = require("./../../../app/models/Merchant")
var jwt = require('jsonwebtoken');


describe('Authentication',function(){
    
    before(function(done){
		db.connect(db.MODE_TEST, function(){
			db.drop([db.tables.merchants.name], function(){
				done();
			});
		});
	});
    describe.only('When invalid email is provided', function(){
        var auth;
        before(function(){
            auth = new Auth({email : "akash@145" , password : "akash"});
        });
        it('should validate email',function(done){
            var emailIsValidSpy = sinon.spy(auth,'validateEmail');
            auth.authenticate(function(){
                sinon.assert.calledOnce(emailIsValidSpy);
                emailIsValidSpy.restore();
                done();
            });            
        });
        it('return success = false', function(done){
            auth.authenticate(function(err, result){
                assert.ok(!result.success, result.message);
                done();
            });            
        });
        it('should set the correct error message', function(done){
            auth.authenticate(function(err, result){
                assert.ok(result.message == error_messages.INVALID_EMAIL, result.message);
                done();
            });
        });
    });
    describe.only('When invalid password is provided',function(){
        var auth;
        before(function(){
            auth = new Auth({email : "akashagarwal0403@gmal.com" , password : "sdsw"});
        });
        it('should verify password',function(done){
            var passwordIsValidSpy = sinon.spy(auth,'validatePassword');
            auth.authenticate(function(){
                sinon.assert.calledOnce(passwordIsValidSpy);
                passwordIsValidSpy.restore();
                done();
            });
        });
        it('should return success = false', function(done){
            auth.authenticate(function(err, result){
                assert.ok(!result.success, result.message);
                done();
            });
        });
        it('should set the correct error message', function(done){
            auth.authenticate(function(err, result){
                assert(result.message == error_messages.INVALID_PASSWORD, result.message);
                done();
            });
        });
    });

    describe.only('When wrong password is entered ',function(){  
        var auth; 
        var response; 
        before(function(done){
            var args = {
                name : "AKASH",
                email : "akashagarwal0403@gmail.com",
                password : "akash@123",
                country_code : "+91",
                number : "9162728446",
                alternate_country_code : "+91",
                alternate_number : "9587658468",
            }
            Merchant.create(args, function(){
                auth = new Auth({
                    email : "akashagarwal0403@gmail.com",
                    password : "akash@454"
                });
                auth.authenticate(function(err, result){
                    response = result;
                    done();
                });
            });
        });
        it('returns success = false', function(){
            assert.ok(!response.success);
        });
        it('return the correct message', function(){
            assert.ok(response.message === error_messages.WRONG_PASSWORD && response.message );
        });
    });
    describe.only('When user exists',function(){  
        var auth; 
        var response; 
        before(function(done){
            var args = {
                name : "AKASH",
                email : "akashagarwal0403@gmail.com",
                password : "akash@123",
                country_code : "+91",
                number : "9162728446",
                alternate_country_code : "+91",
                alternate_number : "9587658468",
            }
            Merchant.create(args, function(){
                auth = new Auth({
                    email : "akashagarwal0403@gmail.com",
                    password : "akash@123"
                });
                auth.authenticate(function(err, result){
                    response = result;
                    done();
                });
            });
        });
        it('returns success = true', function(){
            assert.ok(response.success);
        });
        it('return merchant_exists = true', function(){
            assert.ok(response.merchant_exists);
        });
        it('retrieves merchant information from database', function(){
            assert.ok(response.Merchant);
        });
        it('returns callback with token', function(){
            assert.ok(response.token);
        });
        it('generated jwt token decodeds to user_id', function(done){
            jwt.verify(response.token, process.env.JWT_SECRET || 'mynameissaddacampus', function(err, decoded){
                assert.ok(decoded.merchant_id == response.Merchant.merchant_id);
                done();
            });
        });       
    });

    describe.only('When user does not exist', function(){
        var auth;
        var response;
        before(function(done){
            db.drop([db.tables.merchants.name], function(){
                auth = new Auth({
                    email : "akashagarwal0403@gmail.com",
                    password : "akash@123"
                });
                auth.authenticate(function(err, result){
                    response = result;
                    done();
                });
            });
        });
        it('return success = true', function(){
            assert.ok(response.success === true);
        });
        it('return merchant_exists = false', function(){
            assert.ok(response.merchant_exists === false);
        });
    });

    after(function(done){
        db.drop([db.tables.merchants.name], function(){
            db.end();
            done()
        });   
    });
    
    
});
