var assert = require('assert');
var db = require('../../../app/lib/sadda-db');
var error_messages = require('../../../app/config/error_messages');
var Admin = require('../../../app/models/Admin');
var AdminAuth = require('../processes/admin-auth');
var sinon = require('sinon');
var jwt = require('jsonwebtoken');


describe('Admin authentication', function(){
    before(function(done){
        db.connect(db.MODE_TEST, function(){
            done();
        });
    });
    describe('Sad path', function(){
        describe('When invalid username is provided...', function(){
            var adminAuth;
            var error, response;
            before(function(done){
                adminAuth = new AdminAuth({
                    username: 'asd'
                });
                adminAuth.authenticate(function(err, result){
                    error = err;
                    response = result;
                    done();
                });
            })
            it('error is set to null', function(){
                assert.ok(!error);
            });
            it('returns success = false', function(){
                assert.ok(response.success == false);
            });
            it('username is validated', function(done){
                var usernameIsValidSpy = sinon.spy(adminAuth,'usernameIsValid');
                adminAuth.authenticate(function(){
                    sinon.assert.calledOnce(usernameIsValidSpy);
                    usernameIsValidSpy.restore();
                    done();
                });
            });
            it('sets the correct error message', function(){
                assert.ok(response.message == error_messages.INVALID_USERNAME);
            });
        });
        describe('When invalid password is provided...', function(){
            var adminAuth;
            var error, response;
            before(function(done){
                adminAuth = new AdminAuth({
                    username: 'ananddevesh22',
                    password: '12345'
                });
                adminAuth.authenticate(function(err, result){
                    error = err;
                    response = result;
                    done();
                });
            });
            it('error is set to null', function(){
                assert.ok(!error);
            });
            it('returns success = false', function(){
                assert.ok(response.success == false);
            });
            it('password is validated', function(done){
                var passwordIsValidSpy = sinon.spy(adminAuth,'passwordIsValid');
                adminAuth.authenticate(function(){
                    sinon.assert.calledOnce(passwordIsValidSpy);
                    passwordIsValidSpy.restore();
                    done();
                });
            });
            it('sets the correct error message', function(){
                assert.ok(response.message == error_messages.INVALID_PASSWORD);
            });
        });
        describe('When user does not exist', function(){
            var adminAuth;
            var error, response;
            before(function(done){
                adminAuth = new AdminAuth({
                    username: 'ananddevesh22',
                    password: '123456'
                });
                adminAuth.authenticate(function(err, result){
                    error = err;
                    response = result;
                    done();
                });
            });
            it('error is set to null', function(){
                assert.ok(!error);
            });
            it('return success = false', function(){
                assert.ok(response.success == false);
            });
            it('sets the correct error message', function(){
                assert.ok(response.message == error_messages.USER_DOES_NOT_EXIST, response.message);
            });
        });
        describe('When wrong password is provided', function(){
            var adminAuth;
            var error, response;
            before(function(done){
                Admin.create({
                    username: 'ananddevesh22',
                    email: 'ananddevesh22@gmail.com',
                    password: 'devdas23',
                    role: 'super'
                }, function(){
                    adminAuth = new AdminAuth({
                        username: 'ananddevesh22',
                        password: '123456'
                    });
                    adminAuth.authenticate(function(err, result){
                        error = err;
                        response = result;
                        done();
                    });
                });
            });
            it('error is set to null', function(){
                assert.ok(!error);
            });
            it('return success = false', function(){
                assert.ok(response.success == false);
            });
            it('sets the correct error message', function(){
                assert.ok(response.message == error_messages.WRONG_PASSWORD, response.message);
            });
        });
        describe('When user exists and correct password is provided', function(){
            var adminAuth;
            var error, response;
            before(function(done){
                adminAuth = new AdminAuth({
                    username: 'ananddevesh22',
                    password: 'devdas23'
                });
                adminAuth.authenticate(function(err, result){
                    error = err;
                    response = result;
                    done();
                });
            });
            it('error is set to null', function(){
                assert.ok(!error);
            });
            it('success = true', function(){
                assert.ok(response.success);
            });
            it('token is provided', function(){
                assert.ok(response.token);
            });
            it('token resolves to correct admin_id', function(done){
                jwt.verify(response.token, process.env.JWT_SECRET || 'mynameissaddacampus', function(err, decoded){
                    assert.ok(decoded.admin_id == response.Admin.admin_id);
                    done();
                });
            });
            it('Admin object is returned', function(){
                assert.ok(response.Admin);
            });
            it('Admin object contains admin_id', function(){
                assert.ok(response.Admin.admin_id);
            });
            it('Admin object contains username', function(){
                assert.ok(response.Admin.username);
            });
            it('Admin object contains email', function(){
                assert.ok(response.Admin.email);
            });
            it('Admin object contains role', function(){
                assert.ok(response.Admin.role);
            });
        });
    });

    after(function(done){
        db.drop([db.tables.admins.name], function(){
            db.end();
            done()
        });   
    });
});





