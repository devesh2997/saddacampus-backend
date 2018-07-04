var assert = require('assert');
var validator = require('../validator');

describe('Arguments validator', function(){
    describe('Username validator', function(){
        describe('When valid username is provided', function(){
            it('return true', function(){
                assert.ok(validator.usernameIsValid('ananddevesh22'));
            });
        });
        describe('Returns false when ...', function(){
            it('length of username is less than 5', function(){
                assert.ok(!validator.usernameIsValid('1234'));
            });
            it('length of username is more than 25', function(){
                assert.ok(!validator.usernameIsValid('1234567890qwertyuiopasdfgh'));
            });
        });
    });

    describe('Email validator', function(){
        describe('When valid email is provided', function(){
            it('return true', function(){
                assert.ok(validator.emailIsValid('ananddevesh22@gmail.com'));
            });
        });
        describe('Returns false when email is ...', function(){
            it('a@a.c', function(){
                assert.ok(!validator.emailIsValid('a@a.c'));
            });
            it('@gmail.com', function(){
                assert.ok(!validator.emailIsValid('@gmail.com'));
            });
        });
    });

    describe('Admin role validator', function(){
        describe('Returns true when valid role is provided...', function(){
            it('super', function(){
                assert.ok(validator.adminRoleIsValid('super'));
            });
            it('core', function(){
                assert.ok(validator.adminRoleIsValid('core'));
            });
            it('support', function(){
                assert.ok(validator.adminRoleIsValid('support'));
            });
            it('maintainer', function(){
                assert.ok(validator.adminRoleIsValid('maintainer'));
            });
        });
        describe('Returns false when something other is provided ...', function(){
            it('qwerty', function(){
                assert.ok(!validator.adminRoleIsValid('qwerty'));
            });
        });
    });

    describe('Password validator', function(){
        it('returns true when length of password is more than 5', function(){
            assert.ok(validator.passwordIsValid('devdas23'));
        });
        it('returns false when password is missing', function(){
            assert.ok(!validator.passwordIsValid());
        });
        it('returns false when length of password is less than 6', function(){
            assert.ok(!validator.passwordIsValid('12345'));
        });
	});

	describe('Business id validator', function(){
        it('returns true when length of business_id is 3', function(){
            assert.ok(validator.businessIdIsValid('rdb'));
        });
        it('returns false when business_id is missing', function(){
            assert.ok(!validator.businessIdIsValid());
        });
        it('returns false when length of business_id is less than 3', function(){
            assert.ok(!validator.businessIdIsValid('12'));
		});
		it('returns false when length of business_id is more than 3', function(){
            assert.ok(!validator.businessIdIsValid('12345'));
        });
    });
});

