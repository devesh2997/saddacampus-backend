var assert = require('assert');
var Admin = require('../Admin');
var error_messages = require('../../config/error_messages');
var db = require('../../lib/sadda-db');

describe('Admin - model',function(){
    before(function(done){
        db.connect(db.MODE_TEST, function(){done()});
    });
    describe('Create admin', function(){
        describe('When valid arguments are provided', function(){
            var args ;
            var response;
            var error;
            before(function(done){
                args = {
                    username: 'ananddevesh22',
                    email: 'ananddevesh22@gmail.com',
                    password: 'devdas23',
                    role: 'maintainer'
                }
                db.drop([db.tables.admins.name], function(){
                    Admin.create(args, function(err, result){
                        error = err;
                        response = result;
                        done();  
                    });
                });                 
            });

            it('callback returns with no error', function(){
                assert.ok(!error);
            });
            it('callback returns with Admin object', function(){
                assert.ok(response.Admin);
            });
            it('User object contains admin_id',function(){
                assert.ok(response.Admin.admin_id);
            });
            it('User object contains username',function(){
                assert.ok(response.Admin.username);
            });
            it('User object contains email',function(){
                assert.ok(response.Admin.email);
            });
            it('User object contains role',function(){
                assert.ok(response.Admin.role);
            });
            after(function(done){
                db.drop([db.tables.admins.name], function(){done()});   
            });
        });
        describe('Returns callback with error and sets the correct error messages when ...', function(){
            before(function(done){
                var args = {
                    username: 'ananddevesh22',
                    email: 'ananddevesh22@gmail.com',
                    password: 'devdas23',
                    role: 'maintainer'
                }
                Admin.create(args, function(){
                    done();  
                });                
            });
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
                    assert.ok(err && err.message == error_messages.INVALID_ADMIN_ROLE, err.message);
                    done();
                });
            });
            it('duplicate user exists', function(done){
                Admin.create({
                    username: 'ananddevesh22',
                    email: 'ananddevesh22@gmail.com',
                    password: 'devdas23',
                    role: 'maintainer'
                }, function(err){
                    assert.ok(err && err.message == error_messages.DUPLICATE_USER);
                    done();
                });
            })
            after(function(done){
                db.drop([db.tables.admins.name], function(){done()});   
            });
        });
    });

    describe('Find Admin by username', function(){
        describe('Valid username is provided and admin exists', function(){
            var args ;
            var response;
            var error;
            before(function(done){
                args = {
                    username: 'ananddevesh22',
                    email: 'ananddevesh22@gmail.com',
                    password: 'devdas23',
                    role: 'maintainer'
                }
                Admin.create(args, function(err){
                    if(err)
                        throw err;
                    Admin.findByUsername({
                        username: 'ananddevesh22',
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
            it('callback returns with Admin object', function(){
                assert.ok(response.Admin);
            });
            it('Admin object contains admin_id',function(){
                assert.ok(response.Admin.admin_id);
            });
            it('Admin object contains username',function(){
                assert.ok(response.Admin.username);
            });
            it('Admin object contains email',function(){
                assert.ok(response.Admin.email);
            });
            it('Admin object contains role',function(){
                assert.ok(response.Admin.role);
            });
        });

        describe('callback returns with error when ...', function(){
            it('username is missing', function(done){
                Admin.findByUsername({
                }, function(err){
                    assert.ok(err && err.message == error_messages.INVALID_USERNAME);
                    done();
                });
            });
            it('invalid username is provided',function(done){
                Admin.findByUsername({
                    username: 'SDFS',
                }, function(err){
                    assert.ok(err && err.message == error_messages.INVALID_USERNAME);
                    done();
                });
            });
        });

        describe('When admin does not exist', function(){
            before(function(done){
                db.drop([db.tables.admins.name], function(){done()});
            });
            it('empty Admin object is returned', function(done){
                Admin.findByUsername({
                    username: 'ananddevesh22',
                }, function(err, result){
                    assert.ok(!result.Admin);
                    done();
                });
            });
        });

        after(function(done){
            db.drop([db.tables.admins.name], function(){done()});   
        });
    });

    describe('Find Admin by admin_id', function(){
        var admin_id;
        describe('Valid admin_id is provided and admin exists', function(){
            var args ;
            var response;
            var error;
            before(function(done){
                args = {
                    username: 'ananddevesh22',
                    email: 'ananddevesh22@gmail.com',
                    password: 'devdas23',
                    role: 'maintainer'
                }
                Admin.create(args, function(err, result){
                    if(err)
                        throw err;
                    admin_id = result.Admin.admin_id;
                    Admin.findByAdminID({
                        admin_id: admin_id
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
            it('callback returns with Admin object', function(){
                assert.ok(response.Admin);
            });
            it('Admin object contains admin_id',function(){
                assert.ok(response.Admin.admin_id);
            });
            it('Admin object contains username',function(){
                assert.ok(response.Admin.username);
            });
            it('Admin object contains email',function(){
                assert.ok(response.Admin.email);
            });
            it('Admin object contains role',function(){
                assert.ok(response.Admin.role);
            });
        });

        describe('callback returns with error when ...', function(){
            it('admin is missing', function(done){
                Admin.findByAdminID({
                }, function(err){
                    assert.ok(err && err.message == error_messages.MISSING_PARAMETERS);
                    done();
                });
            });
        });

        describe('When admin does not exist', function(){
            before(function(done){
                db.drop([db.tables.admins.name], function(){done()});
            });
            it('empty Admin object is returned', function(done){
                Admin.findByAdminID({
                    admin_id: admin_id
                }, function(err, result){
                    assert.ok(!result.Admin);
                    done();
                });
            });
        });
    });

    after(function(done){
        db.drop([db.tables.admins.name], function(){done()});   
    });
});

