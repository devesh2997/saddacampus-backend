// var NewUser = require('../models/new_user');
// var assert = require('assert');
// var error_messages = require('../../../../app/config/error_messages');
// var db = require('../../../../app/lib/sadda-db');


// describe('New User Registration',function(){
//     describe('Registration valid when ..', function(){
//         var validUser;
//         before(function(){
//             validUser = new NewUser({country_code:'91', number:'7541833368',username:'ananddevesh22'});
//         });
//         it('mobile number and username is valid',function(){
//             assert.ok(validUser.isValid());
//         });
//         it('generates valid user_id',function(){
//             validUser.generateUserId(function(){
//                 assert.ok(validUser.user_id);
//             });            
//         });
//     });

//     describe('Invalid if...', function(){
//         it('length of mobile number is less than 10',function(){
//             var invalidUser = new NewUser({country_code: 'a',number:'123456789'});
//             assert.ok(!invalidUser.mobileIsValid());
//         });
//         it('length of mobile number is greater than 10',function(){
//             var invalidUser = new NewUser({country_code: 'a',number:'12345678901'});
//             assert.ok(!invalidUser.mobileIsValid());
//         });
//         it('length of mobile number is less than 10',function(){
//             var invalidUser = new NewUser({country_code: 'a',number:'123456789'});
//             assert.ok(!invalidUser.mobileIsValid());
//         });
//         it('invalid username',function(){
//             var invalidUser = new NewUser({username: "fsd"});
//             assert.ok(!invalidUser.usernameIsValid());
//         });
//     });

//     describe('Generates correct validation message', function(){
//         it('"Invalid country-code"',function(){
//             var invalidUser = new NewUser({country_code: 'a',number:'gsd'});
//             assert.ok(invalidUser.validationMessage() == error_messages.INVALID_COUNTRY_CODE);
//         });
//         it('"Invalid mobile-number"',function(){
//             var invalidUser = new NewUser({country_code: '91',number:'gsd'});
//             assert.ok(invalidUser.validationMessage() == error_messages.INVALID_MOBILE_NUMBER);
//         });
//         it('"Invalid username"',function(){
//             var invalidUser = new NewUser({country_code: '91',number:'7541833368',username: "fsd"});
//             assert.ok(invalidUser.validationMessage() == error_messages.INVALID_USERNAME);
//         });
//     });

//     describe('Store user',function(){
//         var validUser;
//         before(function(){
//             validUser = new NewUser({country_code:'91', number:'7541833368',username:'ananddevesh22'}); 
//             validUser.generateUserId(function(){});           
//             db.connect(db.MODE_TEST,function(err) {
//                 if (err) {
//                   console.log('Unable to connect to MySQL.');
//                   process.exit(1);
//                 }
//             });
//             db.drop([db.tables.users.name], function(){});
//         });

//         it('should store user without error', function(done){
//             validUser.store(function(err){
//                 if (err) done(err);
//                 else done();
//             });
//         });

//         it('stored user has verified status');

//         after(function(){
//             db.drop([db.tables.users.name], function(){});   
//         });
//     });

//     describe('Check for duplicates', function(){
//         var validUser;
//         var user_id;
//         before(function(){
//             validUser = new NewUser({country_code:'91', number:'7541833368',username:'ananddevesh22'}); 
//             validUser.generateUserId(function(){});
//             user_id = validUser.user_id;           
//             db.connect(db.MODE_TEST,function(err) {
//                 if (err) {
//                   console.log('Unable to connect to MySQL.');
//                   process.exit(1);
//                 }
//                 validUser.store(function(){
//                 });
//             });
//         });

//         it('should return with no error',function(done){
//             validUser.hasDuplicate(function(err){
//                 assert.ok(!err);
//                 done();
//             });
//         });
//         it('should return true if duplicate user_id found', function(done){
//             var newUser = new NewUser({country_code:'91', number:'1234567890',username:'devd'}); 
//             newUser.user_id = user_id;
//             newUser.hasDuplicate(function(err, hasDuplicate){
//                 assert.ok(hasDuplicate);
//                 done();  
//             })
//         });
//         it('should return true if duplicate username found', function(done){
//             var newUser = new NewUser({country_code:'91', number:'9874563210',username:'ananddevesh22'}); 
//             newUser.generateUserId();
//             newUser.hasDuplicate(function(err, hasDuplicate){
//                 assert.ok(hasDuplicate);
//                 done();  
//             });            
//         });
//         it('should return true if duplicate (country_code + number) found', function(done){
//             var newUser = new NewUser({country_code:'91', number:'7541833368',username:'test'}); 
//             newUser.generateUserId();
//             newUser.hasDuplicate(function(err, hasDuplicate){
//                 assert.ok(hasDuplicate);
//                 done();  
//             });
            
//         });
//         it('should return false if only duplicate number found', function(done){
//             var newUser = new NewUser({country_code:'81', number:'7541833368',username:'qwerty'}); 
//             newUser.generateUserId();
//             newUser.hasDuplicate(function(err, hasDuplicate){
//                 assert.ok(!hasDuplicate);
//                 done();  
//             });            
//         });
//         it('should return false if no duplicate found',function(done){
//             var newUser = new NewUser({country_code:'81', number:'1239874560',username:'qwerty'}); 
//             newUser.generateUserId();
//             newUser.hasDuplicate(function(err, hasDuplicate){
//                 assert.ok(!hasDuplicate);
//                 done();  
//             });
//         });
//         it('should set error_message in case of duplicate found', function(done){
//             var newUser = new NewUser({country_code:'91', number:'7541833368',username:'qwerty'}); 
//             newUser.generateUserId();
//             newUser.hasDuplicate(function(){
//                 assert.ok(newUser.error_message);
//                 done();  
//             });   
//         })

//         after(function(){
//             db.drop([db.tables.users.name], function(){});   
//         });
//     })
// });

