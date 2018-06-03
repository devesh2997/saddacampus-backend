var sinon = require('sinon');
var assert = require('assert');
var Auth = require('../processes/auth');
var error_messages = require('../../../../app/config/error_messages');
var db = require('../../../../app/lib/sadda-db');
var otp = require('../../../../app/lib/otp');
var User = require('../../../../app/models/User');
var jwt = require('jsonwebtoken');


describe('Authentication',function(){
    var correct_otp;
    before(function(done){
        process.env.MODE = 'TEST';
        db.connect(db.MODE_TEST,function(err){
            if(err){
                console.log(err);
                done();
            }else
            db.drop([db.tables.users.name, db.tables.otp.name], function(){
                var SEND_OTP = otp.sendOTP({country_code:'91', number:'7541833368'});
                SEND_OTP.send(function(err, result){
                    if(result.success){       
                        var query = "SELECT * FROM "+ db.tables.otp.name + " WHERE (country_code = '91' AND number = '7541833368' )";
                        db.get().query(query, function(err, result){                            
                            correct_otp = result[0].otp;
                            done();
                        });            
                    }
                });
            });   
        });
    });
    describe('When invalid mobile number is provided', function(){
        var auth;
        before(function(){
            auth = new Auth({country_code:'91', number:'1234568'});
        });
        it('should validate mobile number',function(done){
            var mobileIsValidSpy = sinon.spy(auth,'mobileIsValid');
            auth.authenticate(function(){
                sinon.assert.calledOnce(mobileIsValidSpy);
                mobileIsValidSpy.restore();
                done();
            });            
        });
        it('return success = false', function(done){
            auth.authenticate(function(err, result){
                assert.ok(!result.success, result.message);
                done();
            });            
        });
        it('should set the correct error message', function(done){
            auth.authenticate(function(err, result){
                assert.ok(result.message == error_messages.INVALID_MOBILE_NUMBER, result.message);
                done();
            });
        });
    });
    describe('When invalid otp is provided',function(){
        var auth;
        before(function(){
            auth = new Auth({country_code:'91', number:'7541833368', otp:'654321'});
        });
        it('should verify otp',function(done){
            var validateOTPSpy = sinon.spy(auth,'validateOTP');
            auth.authenticate(function(){
                sinon.assert.calledOnce(validateOTPSpy);
                validateOTPSpy.restore();
                done();
            });
        });
        it('should return success = false', function(done){
            auth.authenticate(function(err, result){
                assert.ok(!result.success, result.message);
                done();
            });
        });
        it('should set the correct error message', function(done){
            auth.authenticate(function(err, result){
                assert(result.message == error_messages.INCORRECT_OTP, result.message+error_messages.INCORRECT_OTP);
                done();
            });
        });
    });

    describe('When user exists',function(){  
        var auth; 
        var response; 
        before(function(done){
            var args = {
                country_code: '91',
                number: '7541833368',
                username: 'ananddevesh22',
                profilepic: ''
            }
            User.create(args, function(){
                auth = new Auth({
                    country_code: '91',
                    number: '7541833368',
                    otp: correct_otp
                });
                auth.authenticate(function(err, result){
                    response = result;
                    done();
                });
            });
        });
        it('returns success = true', function(){
            assert.ok(response.success);
        });
        it('return user_exists = true', function(){
            assert.ok(response.user_exists);
        });
        it('retrieves user information from database', function(){
            assert.ok(response.User);
        });
        it('returns callback with token', function(){
            assert.ok(response.token);
        });
        it('generated jwt token decodeds to user_id', function(done){
            jwt.verify(response.token, process.env.JWT_SECRET || 'mynameissaddacampus', function(err, decoded){
                assert.ok(decoded.user_id == response.User.user_id);
                done();
            });
        });       
    });

    describe('When user does not exist', function(){
        var auth;
        var response;
        before(function(done){
            db.drop([db.tables.users.name], function(){
                auth = new Auth({
                    country_code: '91',
                    number: '7541833368',
                    otp: correct_otp
                });
                auth.authenticate(function(err, result){
                    response = result;
                    done();
                });
            });
        });
        it('return success = true', function(){
            assert.ok(response.success === true);
        });
        it('return user_exists = false', function(){
            assert.ok(response.user_exists === false);
        });
        it('returns callback with token', function(){
            assert.ok(response.token);
        });
        it('generated jwt token decodeds to mobile object', function(done){
            jwt.verify(response.token, process.env.JWT_SECRET || 'mynameissaddacampus', function(err, decoded){
                assert.ok(decoded.country_code == '91' && decoded.number == '7541833368');
                done();
            });
        });  
    });

    after(function(done){
        db.drop([db.tables.users.name, db.tables.otp.name], function(){done()});   
    });
    
    
});
