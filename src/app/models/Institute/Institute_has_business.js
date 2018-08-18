var error_messages = require('../../config/error_messages');
var Resource = require("./../Resource");
var institute_has_business_modal = require('./../modal/Institute_has_business');
var institue = require('./Institue');
var Merchant  = require('./../_Merchants');
var Business = require('./../_Business');
var _ = require('underscore');

var InstituteBusiness= function(){
    Resource.call(this,'InstituesBusiness','institutes_has_businesses',institute_has_business_modal);
    institute_has_business_modal.fields[0].ref_model = institue.getRef();
    institute_has_business_modal.fields[0].ref_model_field_name = 'code';
    institute_has_business_modal.fields[1].ref_model = Merchant.getRef();
    institute_has_business_modal.fields[1].ref_model_field_name = 'merchant_id';
    institute_has_business_modal.fields[2].ref_model = Business.getRef();
    institute_has_business_modal.fields[2].ref_model_field_name = 'business_id';
}
InstituteBusiness.prototype  = Object.create(Resource.prototype);
InstituteBusiness.prototype.constructor = InstituteBusiness;

/**
 * add categories to menu,
 * @param {Object} args
 * @param {String} args.code
 * @param {String} args.merchant_id
 * @param {Number} args.business_id
 */
InstituteBusiness.prototype.addInstitute = function(args,callback){
    if(args && args.code && args.merchant_id && args.business_id){
        this.create(args,function(err,result){
            if(err) return callback(err)
            return callback(null,result)
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * Update Institute 
 * @param {Object} args
 * @param {Object} args.args_old 
 * @param {Object} args.args_update
 */
InstituteBusiness.prototype.updateInstitute = function(args,callback){
    if(args && !_.isEmpty(args.args_old) && !_.isEmpty(args.args_update)){
        this.update(args.args_update,args.args_old,function(err,result){
            if(err) return callback(err)
            return callback(null,result)
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * find the Institute with the provided code
 * @param {Object} args 
 * @param {String} args.code
 */
InstituteBusiness.prototype.findInstitute = function(args,callback){
    if(args && args.code ){
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
 * @param {String} args.code
 * @param {String} args.merchant_id
 * @param {String} args.business_id
 */
InstituteBusiness.prototype.deleteInstitute = function(args,callback){
    if(args && args.code && args.merchant_id && args.business_id){
        this.delete(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

module.exports = new InstituteBusiness();