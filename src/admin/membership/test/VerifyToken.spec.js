// var assert = require('assert');
// var error_messages = require('../../../app/config/error_messages');
// var VerifyToken = require('../VerifyToken');
// var sinon = require('sinon');
// import {res} from '../../../app/utility/http-mock-objects';

// describe('Token verification of admin apis', function(){
//     describe('Sad path', function(){
//         describe('When access token is missing', function(){
// 			var req = {
// 				headers: {
// 					"x-access-token": ""
// 				}
// 			};
// 			var spy = sinon.spy();
// 			before(function(){
// 				VerifyToken.verifyToken(req,res(),spy);
// 			})
// 			it('response status is set to 403', () =>{
// 				assert.ok(res.statusCode === 403);
// 			});
// 			it('next is not called', function(){
// 				sinon.assert.notCalled(spy);
// 			});
// 		});
//         describe('When jwt.verify returns error',function(){

// 		});
//         describe('When Admin.findByAdminId returns error',function(){

// 		});
//         describe('When admin with the corresponding decoded admin_id does not exist',function(){

// 		});
// 	});
// 	describe('When correct token is proved and admin exists',function(){

// 	});
//     describe('Allow Super',function(){

// 	});
//     describe('Allow Core',function(){

// 	});
//     describe('Allow Support',function(){

// 	});
//     describe('Allow Maintainer',function(){

// 	});
// });
