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
});

