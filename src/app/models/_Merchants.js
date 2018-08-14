var error_messages = require('../config/error_messages');
var Resource = require("./Resource");
var Merchant_modal = require('./modal/Merchant');
var Mobile = require('./mobile_number');
var uniqid = require('uniqid');
var bcrypt = require('bcrypt');
var _ = require('underscore');

var Merchant = function(){
    Resource.call(this,'Merchant','merchants',Merchant_modal);
}
Merchant.prototype  = Object.create(Resource.prototype);
Merchant.prototype.constructor = Merchant;


Merchant.prototype.validateMobile = function(country_code , number){
    var mobile = new Mobile({
        country_code : country_code,
        number : number
    });
    if(!mobile.isValid) return false;
    else return true;
}

/**
 * create a new merchant-
 * it validates all the arguments provided and returns appropriate error in case any validation fails.
 * returns Merchant{merchant_id,name, email, country_code, number, alternate_country_code, alternate_number, status} Object
 * @param {Object} args
 * @param {String} args.name
 * @param {String} args.email
 * @param {String} args.password - Atleast 6 characters long
 * @param {String} args.country_code
 * @param {String} args.number
 * @param {String} args.alternate_country_code
 * @param {String} args.alternate_number
 */


Merchant.prototype.addMerchant = function(args,callback){
    if(args && args.name && args.number && args.country_code && args.password && args.email){
        if(!this.validateMobile(args.country_code,args.number)){
            return callback(new Error(error_messages.INVALID_MOBILE_NUMBER));
        }
        var scope = this;
        var saltRounds = 10;
        var merchant_id =  uniqid(args.email.substr(0,4)); //create unique merchant_id
        bcrypt.hash(args.password, saltRounds, function(err, hash) { // generated encrypted_password to be stored in DB
            var encrypted_password = hash;
            var value = {
                merchant_id : merchant_id,
                name : args.name,
                email : args.email,
                encrypted_password : encrypted_password,
                country_code : args.country_code,
                number : args.number,
                alternate_country_code : args.alternate_country_code || '',
                alternate_number : args.alternate_number || ''
            }
            scope.create(value,function(err,result){
                if(err) return callback(err)
                return callback(null,result)
            });
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}
/**
 * Update Merchant 
 * @param {Object} args
 * @param {Object} args.args_old 
 * @param {Object} args.args_update
 */
Merchant.prototype.updateMerchant = function(args,callback){
    if(args && !_.isEmpty(args.args_old) && !_.isEmpty(args.args_update)){
        this.update( args.args_update, args.args_old,function(err,result){
            if(err) return callback(err)
            return callback(null,result)
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * find the Merchant with the provided code
 * @param {Object} args 
 * @param {String} args.merchant_id
 */
Merchant.prototype.findMerchant = function(args,callback){
    if(args && args.merchant_id ){
        this.get(args,function(err,result){
            if(err) return callback(err);
            for(var i=0; i<result.length; i++)
            delete result[i]['encrypted_password'];
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * @param {Object} args
 * @param {String} args.merchant_id
 */
Merchant.prototype.deleteMerchant = function(args,callback){
    if(args && args.merchant_id){
        this.delete(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

module.exports = new Merchant();