var assert = require('assert');
var db = require('../../../app/lib/sadda-db');
var User = require('../User');
var sinon = require('sinon');
var error_messages = require('../../config/error_messages');


describe('User-Model', function(){

    before(function(done){
        db.connect(db.MODE_TEST, function(){done()});
    });

    describe('Create User', function(){

        describe('Valid mobile number and username is provided', function(){
            var args ;
            var response;
            var error;
            before(function(done){
                args = {
                    country_code: '91',
                    number: '7541833368',
                    username: 'ananddevesh22',
                    profilepic: ''
                }
                User.create(args, function(err, result){
                    error = err;
                    response = result;
                    done();  
                }); 
            });
            it('callback returns with no error', function(){
                assert.ok(!error);
            });
            it('callback returns with User object', function(){
                assert.ok(response.User);
            });
            it('User object contains user_id',function(){
                assert.ok(response.User.user_id);
            });
            it('User object contains username',function(){
                assert.ok(response.User.username);
            });
            it('User object contains country_code',function(){
                assert.ok(response.User.country_code);
            });
            it('User object contains number',function(){
                assert.ok(response.User.number);
            });
            it.skip('User object contains profilepic',function(){
                assert.ok(response.User.profilepic);
            });
            it('User object contains status',function(){
                assert.ok(response.User.status);
            });
            it('User object contains created_at',function(){
                assert.ok(response.User.created_at);
            });
        });

        describe('Callback returns with error when...', function(){
            it('country_code is missing', function(done){
                var args = {
                    number: '9835454668',
                    username: 'ananddevesh22',
                    profilepic: ''
                }
                User.create(args, function(err){
                    assert.ok(err && err.message == error_messages.MISSING_PARAMETERS);
                    done();  
                }); 
            });
            it('number is missing', function(done){
                var args = {
                    country_code: '91',
                    username: 'ananddevesh22',
                    profilepic: ''
                }
                User.create(args, function(err){
                    assert.ok(err && err.message == error_messages.MISSING_PARAMETERS);
                    done();  
                }); 
            });
            it('username is missing', function(done){
                var args = {
                    number: '9835454668',
                    country_code: '91',
                    profilepic: ''
                }
                User.create(args, function(err){
                    assert.ok(err && err.message == error_messages.MISSING_PARAMETERS);
                    done();  
                }); 
            });
            it('country_code is invalid', function(done){
                var args = {
                    country_code: 'asdf',
                    number: '9835454668',
                    username: 'ananddevesh22',
                    profilepic: ''
                }
                User.create(args, function(err){
                    assert.ok(err && err.message == error_messages.INVALID_COUNTRY_CODE);
                    done();  
                }); 
            });
            it('number is invalid', function(done){
                var args = {
                    country_code: '91',
                    number: '98354546683',
                    username: 'ananddevesh22',
                    profilepic: ''
                }
                User.create(args, function(err){
                    assert.ok(err && err.message == error_messages.INVALID_MOBILE_NUMBER, err.message);
                    done();  
                }); 
            });
            it('length of username is less than 5', function(done){
                var args = {
                    country_code: '91',
                    number: '9835454668',
                    username: 'fsad',
                    profilepic: ''
                }
                User.create(args, function(err){
                    assert.ok(err && err.message == error_messages.INVALID_USERNAME, err.message);
                    done();  
                }); 
            });
            it('length of username is more than 25', function(done){
                var args = {
                    country_code: '91',
                    number: '9835454668',
                    username: '1234567890qwertyuiopasdfgh',
                    profilepic: ''
                }
                User.create(args, function(err){
                    assert.ok(err && err.message == error_messages.INVALID_USERNAME);
                    done();  
                }); 
            });
            it('duplicate user exists', function(done){
                var args = {
                    country_code: '91',
                    number: '7541833368',
                    username: 'ananddevesh23',
                    profilepic: ''
                }
                User.create(args, function(err){
                    assert.ok(err && err.message == error_messages.DUPLICATE_USER);
                    done();  
                }); 
            });
        });

        after(function(done){
            db.drop([db.tables.users.name], function(){done()});   
        });
    });

    describe('Find User by mobile', function(){
        describe('Valid mobile is provided and user exists', function(){
            var args ;
            var response;
            var error;
            before(function(done){
                args = {
                    country_code: '91',
                    number: '7541833368',
                    username: 'ananddevesh22',
                    profilepic: ''
                }
                User.create(args, function(err){
                    if(err)
                        throw err;
                    User.findByMobile({
                        country_code: '91',
                        number: '7541833368'
                    }, function(err, result){
                        error = err;
                        response = result;
                        done();
                    });
                }); 
            });
            it('callback returns with no error', function(){
                assert.ok(!error);
            });
            it('callback returns with User object', function(){
                assert.ok(response.User);
            });
            it('User object contains user_id',function(){
                assert.ok(response.User.user_id);
            });
            it('User object contains username',function(){
                assert.ok(response.User.username);
            });
            it('User object contains country_code',function(){
                assert.ok(response.User.country_code);
            });
            it('User object contains number',function(){
                assert.ok(response.User.number);
            });
            it.skip('User object contains profilepic',function(){
                assert.ok(response.User.profilepic);
            });
            it('User object contains status',function(){
                assert.ok(response.User.status);
            });
            it('User object contains created_at',function(){
                assert.ok(response.User.created_at);
            });
        });

        describe('callback returns with error when ...', function(){
            it('country_code is missing', function(done){
                User.findByMobile({
                    number: '7541833368'
                }, function(err){
                    assert.ok(err && err.message == error_messages.INVALID_COUNTRY_CODE);
                    done();
                });
            });
            it('invalid country_code is provided',function(done){
                User.findByMobile({
                    country_code: 'SDFS',
                    number: '7541833368'
                }, function(err){
                    assert.ok(err && err.message == error_messages.INVALID_COUNTRY_CODE);
                    done();
                });
            });
            it('number is missing', function(done){
                User.findByMobile({
                    country_code: '91'
                }, function(err){
                    assert.ok(err && err.message == error_messages.INVALID_MOBILE_NUMBER);
                    done();
                });
            });
            it('invalid number is provided',function(done){
                User.findByMobile({
                    country_code: '91',
                    number: '75418333683'
                }, function(err){
                    assert.ok(err && err.message == error_messages.INVALID_MOBILE_NUMBER);
                    done();
                });
            });
            it('user does not exist',function(done){
                db.drop([db.tables.users.name], function(){
                    User.findByMobile({
                        country_code: '91',
                        number: '7541833368'
                    }, function(err){
                        assert.ok(err && err.message == error_messages.USER_DOES_NOT_EXIST);
                        done();
                    })
                });   
                
            });
        });

        after(function(done){
            db.drop([db.tables.users.name], function(){done()});   
        });
    });

});

