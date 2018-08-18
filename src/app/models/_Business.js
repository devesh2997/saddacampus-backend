var error_messages = require('../config/error_messages');
var Resource = require("./Resource");
var Business_modal = require('./modal/Business');
var Merchant  = require('./_Merchants');
var _ = require('underscore');

var Business = function(){
    Resource.call(this,'Business', 'businesses',Business_modal);
    Business_modal.fields[1].ref_model = Merchant.getRef();
    Business_modal.fields[1].ref_model_field_name = 'merchant_id';
}
Business.prototype  = Object.create(Resource.prototype);
Business.prototype.constructor = Business;



/**
 * Create a new business
 * @param {Object} args
 * @param {String} args.merchant_id
 * @param {String} args.business_id
 * @param {String} args.name
 * @param {String} args.address
 * @param {String} args.type
 * @param {String} args.gstin
 */
Business.prototype.addBusiness = function(args,callback){
    if(args && args.merchant_id && args.business_id && args.name && args.address && args.type){
        args.gstin = args.gstin || '';
        args.status = 'disabled';    
        this.create(args,function(err,result){
            if(err) return callback(err)
            return callback(null,result)
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * Update Business 
 * @param {Object} args
 * @param {Object} args.args_old 
 * @param {Object} args.args_update
 */
Business.prototype.updateBusiness = function(args,callback){
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
 * find the Business with the provided code
 * @param {Object} args 
 * @param {String} args.business_id
 */
Business.prototype.findBusiness = function(args,callback){
    if(args && args.business_id ){
        this.get(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * @param {Object} args
 * @param {String} args.business_id
 * @param {String} args.merchant_id
 */
Business.prototype.deleteBusiness = function(args,callback){
    if(args && args.business_id && args.merchant_id){
        this.delete(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

module.exports = new Business();