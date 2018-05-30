var db = require('../../sadda-db');
var db_utils = require('../../db-utils');
var db_tables = db.tables;
var Log = require('../../log');
var moment = require('moment');
var assert = require('assert');
var error_messages = require('../../../config/error_messages');


/**
 * OTP model 
 * @param {Object} args
 * @param {String} args.country_code
 * @param {String} args.number
 */

var OTP = function(args){
    assert(args.country_code && args.number);
    var context = this;

    /**
    * generates 6 digit random number
    */
    this.generate = function(callback){
        context.otp =  Math.floor(100000 + Math.random() * 900000);
        if(context.otp)
            callback(null, true);
        else
            callback(new Error(error_messages.UNKNOWN_ERROR));
    }

    /**
     * generate message
     */
    this.generateMessage = function(callback){
        context.message = 'Your OTP for mobile number verification is '+context.otp+'. It is valid for 10 minutes.';
        if(context.message)
            callback(null, true);
        else
            callback(new Error(error_messages.UNKNOWN_ERROR));
    }

    /**
     * deletes current otp from database
     */
    this.deleteOTP = function(callback){
        var query = 'DELETE FROM otp WHERE (country_code = '+ args.country_code + ' AND number = '+ args.number + ' )';
        db.get().query(query, function(err){
            if(err){
                Log.e(err);
                callback(err);
            }else{
                callback(null,true);
            }
        });
    }


    /**
     * insert otp into database
     */
    this.insertOTP = function(callback){

        var generation_date = new Date().toLocaleString();
        var expiry = moment().add(10, 'minutes').toDate().toLocaleString();    

        var values = [
            args.country_code, args.number, context.otp, generation_date, expiry 
        ];
        
        var query = db_utils.query_creator.insert({
            table_name: db_tables.otp.name,
            fields: db_tables.otp.fields,
            values: values});

        db.get().query(query, values, function(err){
            if(err){
                Log.e(err);
                callback(err);
            }else{
                callback(null, true);
            }
        });
    }

    /**
     * verify otp
     */

    this.verifyOTP = function(callback){
        var query = "SELECT * FROM "+ db_tables.otp.name + " WHERE (country_code = "+ args.country_code + " AND number = "+args.number + " )";
        db.get().query(query, args.values, function(err, result){
            if (err){
                Log.e(err.toString());
                callback(new Error(error_messages.UNKNOWN_ERROR));
            } 
            if(result.length){
                if(result[0].otp == context.otp){
                    callback(null, true);
                }else{
                    callback(null,false);
                }
            }else{
                callback(null,false);
            }
        });
    }

}

module.exports = OTP;


