var assert = require('assert');
var Admin = require('../Admin');
var error_messages = require('../../config/error_messages');

describe('Admin - model',function(){
    describe('Create admin', function(){
        describe('Returns callback with error and sets the correct error messages when ...', function(){
            it('length of username is less than 5', function(done){
                Admin.create({username: 'asdf'}, function(err){
                    assert.ok(err && err.message == error_messages.INVALID_USERNAME);
                    done();
                });
            });
            it('length of username is more than 25', function(done){
                Admin.create({username: '1234567890qwertyuiopasdfghjk'}, function(err){
                    assert.ok(err && err.message == error_messages.INVALID_USERNAME);
                    done();
                });
            });
            it('invalid email is provided', function(done){
                Admin.create({
                    username: 'ananddevesh22',
                    email: 'a@a.c'
                }, function(err){
                    assert.ok(err && err.message == error_messages.INVALID_EMAIL);
                    done();
                });
            });
            it('length of password is less than 6', function(done){
                Admin.create({
                    username: 'ananddevesh22',
                    email: 'ananddevesh22@gmail.com',
                    password: '12345'
                }, function(err){
                    assert.ok(err && err.message == error_messages.INVALID_PASSWORD);
                    done();
                });
            });
            it('invalid role is provided', function(done){
                Admin.create({
                    username: 'ananddevesh22',
                    email: 'ananddevesh22@gmail.com',
                    password: '123456',
                    role: 'qwerty'
                }, function(err){
                    assert.ok(err && err.message == error_messages.INVALID_ADMIN_ROLE);
                    done();
                });
            })
        });
    });
});

