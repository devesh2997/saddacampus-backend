var assert = require('assert');
var NumberValidator = require('../mobile-validator');
var error_messages = require('../../config/error_messages');


describe('mobile-validator', function(){
    var validNumber ; 

    before(function(){
        validNumber = new NumberValidator({country_code: '1-34+', number:'7541833368'});
    });

    describe('Using correct country code and mobile number', function(){

        it('is valid',function(){
            assert.ok(validNumber.isValid(), "Invalid number");
        });
        it('has a valid country code',function(){
            assert.ok(validNumber.countryCodeIsValid(), "Invalid country code")
        });
        it('has a valid number', function(){
            assert.ok(validNumber.numberIsValid(), "Invalid mobile number");
        });
    });

    describe('Number invalid if', function(){
        it('country code is absent', function(){
            var num = new NumberValidator({});
            assert.ok(!num.countryCodeIsValid());
        });
        it('country code is null', function(){
            var num = new NumberValidator({country_code: null});
            assert.ok(!num.countryCodeIsValid());
        });
        it('country code is undefined', function(){
            var num = new NumberValidator({country_code: undefined});
            assert.ok(!num.countryCodeIsValid());
        });
        it('country code contains characters other than digit or hyphen',function(){
            var num = new NumberValidator({country_code: 'a2-'});
            assert.ok(!num.countryCodeIsValid());
        });
        it('number is absent', function(){
            var num = new NumberValidator({});
            assert.ok(!num.numberIsValid());
        });
        it('number is null', function(){
            var num = new NumberValidator({number: null});
            assert.ok(!num.numberIsValid());
        });
        it('number is undefined', function(){
            var num = new NumberValidator({number: undefined});
            assert.ok(!num.numberIsValid());
        });
        it('length of number is greater than 10', function(){
            var num = new NumberValidator({number: '78945612307'});
            assert.ok(!num.numberIsValid());
        });
        it('length of number is less than 10', function(){
            var num = new NumberValidator({number: '456'});
            assert.ok(!num.numberIsValid());
        });
        it('number contains characters other than digit', function(){
            var num = new NumberValidator({number: 'a-22345678'});
            assert.ok(!num.numberIsValid());
        });
    });

    describe('Returns correct validation message',function(){
        it('"Invalid country-code"',function(){
            var num = new NumberValidator({country_code: 'a2-'});
            assert.ok(num.validationMessage() == error_messages.INVALID_COUNTRY_CODE);
        });
        it('"Invalid mobile-number"',function(){
            var num = new NumberValidator({country_code: '91',number: 'a2-'});
            assert.ok(num.validationMessage() == error_messages.INVALID_MOBILE_NUMBER);
        });
    });
});