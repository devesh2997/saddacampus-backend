var assert = require('assert');

var Registration = require('../lib/processes/registration');

describe('Registration',function(){
    describe('Using valid country code, number, username...', function(){
        it('is valid', function(){
            
        });
        it('should create uid');
        it('should store user info in database');
        it('return success=true');
    });

    describe('Calls callback with correct error_message when..', function(){
        it('invalid mobile number is passed');
        it('Invalid country code is passed');
        it('Invalid username is passsed');
        it('Duplicate user exists');
    });
});