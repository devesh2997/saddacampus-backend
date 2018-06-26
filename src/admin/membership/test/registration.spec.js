var assert = require('assert');
var Reg = require('../processes/registration');
var db = require('../../../app/lib/sadda-db');
var error_messages = require('../../../app/config/error_messages');
var Roles = require('../../config/roles');

describe('Admin user creation', function(){
    before(function(done){
        db.connect(db.MODE_TEST, function(){
            db.drop([db.tables.users.name], function(){done()})
        });
    });
    describe('When valid arguments is provided', function(){
        var error, response;
        before(function(done){
            var reg = new Reg({
                username: 'ananddevesh22',
                email: 'ananddevesh22@gmail.com',
                password: 'devdas23',
                role: Roles.SUPPORT
            });
            reg.register(function(err, result){
                error = err,
                response = result;
                done();
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
    describe('Sad path', function(){
        describe('When invalid username is provided', function(){
            var error, response;
            before(function(done){
                var reg = new Reg({
                    username: 'asdf',
                    email: 'ananddevesh22@gmail.com',
                    password: 'devdas23',
                    role: Roles.SUPPORT
                });
                reg.register(function(err, result){
                    error = err,
                    response = result;
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
                assert.ok(response.message == error_messages.INVALID_USERNAME);
            });

            after(function(done){
                db.drop([db.tables.admins.name], function(){done()});
            });
        });
        describe('When invalid email is provided', function(){
            var error, response;
            before(function(done){
                var reg = new Reg({
                    username: 'ananddevesh22',
                    email: '@gmail.com',
                    password: 'devdas23',
                    role: 'support'
                });
                reg.register(function(err, result){
                    error = err,
                    response = result;
                    done();
                });
			});
			it('error should be null', function(){
				assert.ok(error===null);
			});
            it('returns success = false', function(){
                assert.ok(response.success === false);
            });
            it('sets correct error message', function(){
                assert.ok(response.message == error_messages.INVALID_EMAIL);
            });

            after(function(done){
                db.drop([db.tables.admins.name], function(){done()});
            });
        });
        describe('When invalid password is provided', function(){
            var error, response;
            before(function(done){
                var reg = new Reg({
                    username: 'ananddevesh22',
                    email: 'ananddevesh22@gmail.com',
                    password: 'devda',
                    role: 'support'
                });
                reg.register(function(err, result){
                    error = err,
                    response = result;
                    done();
                });
            })
            it('returns success = false', function(){
                assert.ok(response.success === false);
            });
            it('sets correct error message', function(){
                assert.ok(response.message == error_messages.INVALID_PASSWORD);
            });

            after(function(done){
                db.drop([db.tables.admins.name], function(){done()});
            });
        });
        describe('When invalid role is provided', function(){
            var error, response;
            before(function(done){
                var reg = new Reg({
                    username: 'ananddevesh22',
                    email: 'ananddevesh22@gmail.com',
                    password: 'devdas23',
                    role: 'qwert'
                });
                reg.register(function(err, result){
                    error = err,
                    response = result;
                    done();
                });
            })
            it('returns success = false', function(){
                assert.ok(response.success === false);
            });
            it('sets correct error message', function(){
                assert.ok(response.message == error_messages.INVALID_ADMIN_ROLE);
            });

            after(function(done){
                db.drop([db.tables.admins.name], function(){done()});
            });
        });
        describe('When duplicate user is provided', function(){
            var error, response;
            before(function(done){
                var reg = new Reg({
                    username: 'ananddevesh22',
                    email: 'ananddevesh22@gmail.com',
                    password: 'devdas23',
                    role: 'support'
                });
                reg.register(function(err, result){
                    reg.register(function(err, result){
                        error = err,
                        response = result;
                        done();
                    });
                });
            })
            it('returns success = false', function(){
                assert.ok(response.success === false);
            });
            it('sets correct error message', function(){
                assert.ok(response.message == error_messages.DUPLICATE_USER);
            });

            after(function(done){
                db.drop([db.tables.admins.name], function(){db.end();done()});
            });
        });
    });
});
