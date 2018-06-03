var sinon = require('sinon');
var assert = require('assert');
var Auth = require('../processes/auth');
var error_messages = require('../../../../app/config/error_messages');
var db = require('../../../../app/lib/sadda-db');
var otp = require('../../../../app/lib/otp');


describe('Authentication',function(){
    before(function(done){
        process.env.MODE = 'TEST';
        db.connect(db.MODE_TEST,function(err){
            if(err)
                console.log(err);
            else
                done();
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
        before(function(done){
            var SEND_OTP = otp.sendOTP({country_code:'91', number:'7541833368'});
            SEND_OTP.send(function(err, result){
                if(result.success){
                    auth = new Auth({country_code:'91', number:'7541833368', otp:'654321'});       
                    done();             
                }
            });
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
        it('retrieves user information from database');
        it('generates jwt token with user_id');
        it('sends back success = true,token, mobile number and username');        
    });

    describe('When user does not exist', function(){
        it('generates jwt token with mobile number');
        it('should return success = true');
        it('sends back the token generated');   
    });
    
    
});
