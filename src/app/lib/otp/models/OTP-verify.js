var db = require('../../sadda-db');
var db_tables = db.tables;
var Log = require('../../log');
var assert = require('assert');
var error_messages = require('../../../config/error_messages');


/**
 * OTP model 
 * @param {Object} args
 * @param {String} args.country_code
 * @param {String} args.number
 * @param {String} args.otp
 */

var OTP_Verify = function(args){
    assert(args.country_code && args.number && args.otp);
    var context = this;


    /**
     * retrieve otp
     */

    this.retrieveOTP = function(callback){
        var query = "SELECT * FROM "+ db_tables.otp.name + " WHERE (country_code = "+ args.country_code + " AND number = "+args.number + " )";
        db.get().query(query, args.values, function(err, result){
            if (err){
                Log.e(err.toString());
                callback(new Error(error_messages.UNKNOWN_ERROR));
            } 
            if(result.length){
                context.correct_otp = result[0].otp;
                context.expiry = result[0].expiry.toLocaleString();
                callback(null,true);
            }else{
                callback(new Error(error_messages.UNKNOWN_ERROR));
            }
        });
    }

    /**
     * verify expiry
     */
    this.verifyExpiry = function(){
        var currentTime = new Date().toLocaleString();
        if(currentTime <= context.expiry){
            return true;
        }else{
            return false;
        }
    }

    //verify otp
    this.verifyOTP = function(){
        if(context.correct_otp == args.otp){
            return true;
        }else{
            return false;
        }
    }


    this.verify = function(){
        return this.verifyExpiry() && this.verifyOTP();
    }   

}

module.exports = OTP_Verify;


