var assert = require('assert');
var db = require('../../../../app/lib/sadda-db');
var Reg = require('../processes/registration');
var User = require('../../../../app/models/User');
var jwt = require('jsonwebtoken');
var error_messages = require('../../../../app/config/error_messages');

describe('Registration',function(){
    before(function(done){
        db.connect(db.MODE_TEST, function(){
            done();
        });
    });
    describe('When valid mobile, username is provided', function(){
        var reg;
        var response;
        before(function(done){
            reg = new Reg({
                country_code: '91',
                number: '7541833368',
                username: 'ananddevesh22',
                profilepic: ''
            });
            reg.register(function(err, result){
                response = result;
                done();
            });
        });
        it('creates user in database', function(done){
            User.findByMobile({
                country_code: '91',
                number: '7541833368'
            }, function(err, result){
                assert.ok(result.User);
                done();
            });
        });
        it('returns success = true',function(){
            assert.ok(response.success === true);
        });
        it('returns jwt token signed with user_id',function(){
            assert.ok(response.token);
        });
        it('generated jwt token decodes to correct user_id', function(done){
            jwt.verify(response.token, process.env.JWT_SECRET || 'mynameissaddacampus', function(err, decoded){
                assert.ok(decoded.user_id == response.User.user_id);
                done();
            });
        });
        it('returns User object', function(){
            assert.ok(response.User);
        });
        
    });

    describe('When user already exists', function(){
        var reg;
        var response;
        before(function(done){
            reg = new Reg({
                country_code: '91',
                number: '7541833368',
                username: 'ananddevesh22',
                profilepic: ''
            });
            reg.register(function(err, result){
                response = result;
                done();
            });
        });
        it('returns success = false',function(){
            assert.ok(response.success === false);
        });
        it('sets correct error message', function(){
            assert.ok(response.message == error_messages.DUPLICATE_USER);
        });

        after(function(done){
            db.drop([db.tables.users.name], function(){done()});   
        });
    });

    describe('When invalid mobile number is provided', function(){
        var reg;
        var response;
        before(function(done){
            reg = new Reg({
                country_code: '91',
                number: '75418333689',
                username: 'ananddevesh22',
                profilepic: ''
            });
            reg.register(function(err, result){
                response = result;
                done();
            });
        });
        it('returns success = false', function(){
            assert.ok(response.success === false);
        });
        it('sets correct error message', function(){
            assert.ok(response.message = error_messages.INVALID_MOBILE_NUMBER);
        });
        after(function(done){
            db.drop([db.tables.users.name], function(){done()});   
        });
    });

    describe('When invalid username is provided', function(){
        var reg;
        var response;
        before(function(done){
            reg = new Reg({
                country_code: '91',
                number: '75418333689',
                username: 'asdf',
                profilepic: ''
            });
            reg.register(function(err, result){
                response = result;
                done();
            });
        });
        it('returns success = false', function(){
            assert.ok(response.success === false);
        });
        it('sets correct error message', function(){
            assert.ok(response.message = error_messages.INVALID_USERNAME);
        });
        after(function(done){
            db.drop([db.tables.users.name], function(){done()});   
        });
    });

    

    after(function(done){
        db.drop([db.tables.users.name, db.tables.otp.name], function(){done()});   
    });

});


