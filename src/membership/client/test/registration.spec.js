var assert = require('assert');

var Registration = require('../lib/processes/registration');

describe('Registration',function(){
    describe('Using valid country code, number, username...', function(){
        it('has valid mobile number(country_code + number)');
        it('has valid username');
        it('should create uid');
        it('should store user info in database');
        it('return success=true');
    });
});