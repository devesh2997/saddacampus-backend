import assert from 'assert';
var error_messages = require('../app/config/error_messages');
var VerifyToken = require('./VerifyToken');
var sinon = require('sinon');
var mock = require('../app/utility/http-mock-objects');
var Admin = require('../app/models/Admin');
var Roles = require('./config/roles');



describe('Token verification of admin apis', () =>{
    describe('Sad path', function(){
        describe('When access token is missing', function(){
			const req = new mock.Request({"x-access-token": ""});
			const res = new mock.Response();
			var spy = sinon.spy();
			before(function(){
				VerifyToken.verifyToken(req,res,spy);
			})
			it('response status is set to 403', () =>{
				assert.ok(res.statusCode === 403);
			});
			it('next is not called', function(){
				sinon.assert.notCalled(spy);
			});
			it('returns success = false',()=>{
				assert.ok(res.response.success === false);
			});
			it('sets the correct error message', ()=>{
				assert.ok(res.response.message == error_messages.NO_TOKEN_PROVIDED, res.response.success);
			});
		});
	});
	describe('When correct token is proved and admin exists',function(){
		let admin_token, req, res, spy;

		before(function(done){
			Admin.create({
				username: 'saddacampussuper',
				email: 'saddacampus@gmail.com',
				password: 'Campusjoy69',
				role: Roles.SUPER
			}, function(err, result){
				admin_token = result.Admin.admin_id;
				req = new mock.Request({'x-access-token': admin_token});
				res = new mock.Response();
				spy = sinon.spy();
				VerifyToken.allowAll(req,res,spy);
				done();
			});
			it('callback should be called', function(){
				sinon.assert.called(spy);
			});
		});
	});
    describe('Allow Super',function(){
		it('');
	});
    describe('Allow Core',function(){
		it('');
	});
    describe('Allow Support',function(){
		it('');
	});
    describe('Allow Maintainer',function(){
		it('');
	});
});
