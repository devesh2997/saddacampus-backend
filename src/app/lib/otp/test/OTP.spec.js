var otp_methods = require('../utils/otp-methods');
var db = require('../../sadda-db');
var assert = require('assert');


describe('OTP-Methods', function(){
    describe('otp generation', function(){
        var otp;
        before(function(){
            otp = otp_methods.generate();
        })
        it('otp is more than 99999',function(){
            assert(otp > 99999);
        });
        it('otp is less than 1000000',function(){
            assert(otp < 1000000);
        });
        it('generates different otps in different calls',function(){
            var new_otp = otp_methods.generate();
            assert(otp !== new_otp);
        });
    });
});