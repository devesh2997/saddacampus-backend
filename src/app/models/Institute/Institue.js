var error_messages = require('../../config/error_messages');
var Resource = require("./../Resource");
var institute_modal = require('./../modal/Institute')
var city = require('./City');
var _ = require('underscore');

var Institute= function(institute){
    Resource.call(this,'Institues','institutes',institute_modal);
    this.institute = institute;
    institute_modal.fields[3].ref_model = city.getRef();
    institute_modal.fields[3].ref_model_field_name = 'cities_id';
}
Institute.prototype  = Object.create(Resource.prototype);
Institute.prototype.constructor = Institute;

/**
 * add categories to menu,
 * @param {Object} args
 * @param {String} args.code
 * @param {String} args.name
 * @param {Number} args.city_code
 */
Institute.prototype.addInstitute = function(args,callback){
    if(args && args.code && args.name && args.city_code){
        this.institute.create(args,function(err,result){
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
Institute.prototype.updateInstitute = function(args,callback){
    if(args && !_.isEmpty(args.args_old) && !_.isEmpty(args.args_update)){
        this.institute.update({args_set : args.args_update, args_where : args.args_old},function(err,result){
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
Institute.prototype.findInstitute = function(args,callback){
    if(args && args.code ){
        this.institute.get(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * Delete Institute
 * returns {affectedRows}
 * @param {Object} args
 * @param {String} args.code
 */
Institute.prototype.deleteInstitute = function(args,callback){
    if(args && args.code){
        this.institute.delete(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

module.exports = new Institute(new Institute());