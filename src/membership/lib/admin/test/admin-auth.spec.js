var assert = require('assert');
var db = require('../../../../app/lib/sadda-db');
var error_messages = require('../../../../app/config/error_messages');
var Admin = require('../../../../app/models/Admin');
var AdminAuth = require('../processes/admin-auth');


describe('Admin authentication', function(){
    describe('Sad path', function(){
        describe('When invalid username is provided...', function(){
            var error, response;
            before(function(done){
                var adminAuth = new AdminAuth({
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
            it('returns success = false');
            it('username is validated');
            it('sets the correct error message');
        })
    })
});





