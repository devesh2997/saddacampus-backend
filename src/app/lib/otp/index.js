var SEND_OTP = require('./processes/send-otp');
var VERIFY_OTP = require('./processes/verify-otp');

/**
 * sending otp to a given mobile number
 * @param {Object} args
 * @param {String} args.country_code
 * @param {String} args.number
 */
exports.sendOTP = function(args){
    return new SEND_OTP(args);
}


/**
 * verify otp sent to a given mobile number
 * @param {Object} args
 * @param {String} args.country_code
 * @param {String} args.number
 * @param {String} args.otp
 */
exports.verifyOTP = function(args){
    return new VERIFY_OTP(args);
}

