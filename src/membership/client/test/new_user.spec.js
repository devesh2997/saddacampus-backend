var NewUser = require('../lib/models/new_user');
var assert = require('assert');
var error_messages = require('../../config/error_messages');


describe('New User',function(){
    describe('Valid mobile number and username', function(){
        var validUser;
        before(function(){
            validUser = new NewUser({country_code:'91', number:'7541833368',username:'ananddevesh22'});
        });
        it('is valid',function(){
            assert.ok(validUser.isValid());
        });
        it('has mobile number is valid',function(){
            assert.ok(validUser.validateMobileNumber());
        });
        it('has valid username',function(){
            assert.ok(validUser.validateUsername());
        });
        it('generates valid uid');
    });

    describe('Invalid if...', function(){
        it('invalid mobile number',function(){
            var invalidUser = new NewUser({country_code: 'a',number:'gsd'});
            assert.ok(!invalidUser.validateMobileNumber());
        });
        it('invalid username',function(){
            var invalidUser = new NewUser({username: "fsd"});
            assert.ok(!invalidUser.validateUsername());
        });
    });

    describe('Generates correct validation message', function(){
        it('"Invalid country-code"',function(){
            var invalidUser = new NewUser({country_code: 'a',number:'gsd'});
            assert.ok(invalidUser.validationMessage() == error_messages.INVALID_COUNTRY_CODE);
        });
        it('"Invalid mobile-number"',function(){
            var invalidUser = new NewUser({country_code: '91',number:'gsd'});
            assert.ok(invalidUser.validationMessage() == error_messages.INVALID_MOBILE_NUMBER);
        });
        it('"Invalid username"',function(){
            var invalidUser = new NewUser({country_code: '91',number:'7541833368',username: "fsd"});
            assert.ok(invalidUser.validationMessage() == error_messages.INVALID_USERNAME);
        });
    });
});

