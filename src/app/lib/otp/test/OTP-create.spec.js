var OTP_Create = require('../models/OTP-create');
var db = require('../../sadda-db');
var assert = require('assert');
var sinon = require('sinon');


describe('OTP-Create', function(){
    describe('otp generation', function(){
        var otp_create;
        before(function(done){
            otp_create = new OTP_Create({country_code: '+91', number: '7541833368'});
            otp_create.generate(function(){
                done();
            });
        });
        it('otp is more than 99999',function(){
            assert(otp_create.otp > 99999);
        });
        it('otp is less than 1000000',function(){
            assert(otp_create.otp < 1000000);
        });
        it('generates different otps in different calls',function(){
            var new_otp = new OTP_Create({country_code: '+91', number: '7541833368'});
            new_otp.generate(function(){
                assert(otp_create.otp !== new_otp.otp);
            });
            
        });
    });

    describe('otp message generation', function(){
        it('generate correct message.');
        it('should call callback with no error');
        it('should return true to callback');
    });

    describe('delete otp from database',function(){
        before(function(done){
            db.connect(db.MODE_TEST, function(err) {
                if (err) {
                  console.log('Unable to connect to MySQL.');
                  process.exit(1);
                }
                done();
            });
        });
        it('should use correct query');
        it('should call callback with no error if successfully deleted');
        it('should callback with true if successfully deleted');
        it('should call callback with error if unsuccessfull');
    });

    describe('insert otp into database',function(){
        it('should generate correct query');
        it('should call callback with no error if successfully inserted');
        it('should callback with true if successfully inserted');
        it('should call callback with error if unsuccessfull');
    });
});