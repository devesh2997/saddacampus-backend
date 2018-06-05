var db = require('../../../app/lib/sadda-db');
var UserAvailabilty = require('../processes/username-availability');
var error_messages = require('../../../app/config/error_messages');
var assert = require('assert');
var User = require('../../../app/models/User');

describe('Username availability', function(){
    before(function(done){
        db.connect(db.MODE_TEST, function(){done()});
    });
    describe('When invalid username is provided', function(){
        var error, response;
        before(function(done){
            UserAvailabilty.isUsernameAvailable('asdf', function(err, result){
                error = err;
                response = result;
                done();
            });
        });
        it('should return callback with error', function(){
            assert.ok(error);
        });
        it('sets appropriate error message',function(){
            assert.ok(error.message == error_messages.INVALID_USERNAME);
        });
    });
    describe('When username is available', function(){
        var error, response;
        before(function(done){
            UserAvailabilty.isUsernameAvailable('saddacampus', function(err, result){
                error = err;
                response = result;
                done();
            });
        });
        it('returns callback with no error', function(){
            assert.ok(!error);
        });
        it('returns true in callback',function(){
            assert.ok(response === true);
        });
    });
    describe('When username is not available', function(){
        var error, response;
        before(function(done){
            User.create({
                country_code: '92',
                number: '1234567890',
                username: 'devesh',
                profilepic: ' '
            },function(){
                UserAvailabilty.isUsernameAvailable('devesh', function(err, result){
                    error = err;
                    response = result;
                    done();
                });
            });
        })
        it('returns callback with no error', function(){
            assert.ok(!error);
        });
        it('returns false in callback',function(){
            assert.ok(response === false);
        });
    });

    after(function(done){
        db.drop([db.tables.users.name], function(){
            db.end();
            done()
        });   
    });
});