// var assert = require('assert');
// var db = require('../../../../app/lib/sadda-db');
// var sinon = require('sinon');
// var Registration = require('../processes/registration');

// describe('Registration',function(){
//     before(function(done){
//         db.connect(db.MODE_TEST,function(err) {
//             if (err) {
//               console.log('Unable to connect to MySQL.');
//               process.exit(1);
// 			}
// 			done();
//         });
        
//     })
//     describe('Using valid country code, number, username...', function(){
//         var decision;
//         var args = {
//             country_code: '91',
//             number: '7541833368',
//             username: 'ananddevesh22'
//         }
// 		var reg = new Registration(args);
// 		sinon.spy(reg,"validateUserCredentials");
// 		sinon.spy(reg,"checkForDuplicateUsers");
// 		sinon.spy(reg,"createUserId");
// 		sinon.spy(reg,"storeUser");
//         before(function(done){
// 			db.drop([db.tables.users.name], function(){
// 				reg.processRegistration(function(err, result){
// 					decision = result;
// 					done();
// 				});
// 			});			           
//         });
//         it('return success', function(){
// 			assert(decision.success, decision.message);
//         });
//         it('checks user credentials',function(){
// 			reg.validateUserCredentials.called;
// 		});
//         it('checks for duplicates',function(){
// 			reg.checkForDuplicateUsers.called;
// 		});
//         it('created user id',function(){
// 			reg.createUserId.called;
// 		});
// 		it('stores user',function(){
// 			reg.storeUser.called;
// 		});

// 		after(function(done){
// 			db.drop([db.tables.users.name], function(){
// 				done();
// 			});
// 		});
//     });

//     describe('Sad path', function(){
//         var args = {
//             country_code: '91',
//             number: '7541833368',
//             username: 'ananddevesh22'
//         }
// 		var reg = new Registration(args);
//         before(function(done){
// 			reg.processRegistration(function(){
// 				done();
// 			});		           
//         });
//         it('return success=false when duplicate user exists',function(){
// 			var newReg = new Registration(args);
// 			newReg.processRegistration(function(err, result){
// 				assert(!result.success);
// 			});
// 		});
//         it('return success=false when invalid mobile number is passed',function(){
// 			var new_args =  {
// 				country_code: '91',
// 				number: '546565',
// 				username: 'ananddevesh22'
// 			}
// 			var newReg = new Registration(new_args);
// 			newReg.processRegistration(function(err, result){
// 				assert(!result.success);
// 			});
// 		});
//         it('return success=false when invalid username is passed',function(){
// 			var new_args =  {
// 				country_code: '91',
// 				number: '7541833368',
// 				username: '4543'
// 			}
// 			var newReg = new Registration(new_args);
// 			newReg.processRegistration(function(err, result){
// 				assert(!result.success);
// 			});
// 		});
		
// 		after(function(done){
// 			db.drop([db.tables.users.name], function(){
// 				done();
// 			});
// 		});
//     });
// });