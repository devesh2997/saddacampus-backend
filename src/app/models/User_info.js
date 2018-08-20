var error_messages = require('../config/error_messages');
var Resource = require("./Resource");
var User_modal = require('./modal/UserInfo');
var institute = require('./Institute/Institue');
var _ = require('underscore');

var User = function(){
    Resource.call(this,'User_Info','user_info',User_modal);
    User_modal.fields[6].ref_model = institute.getRef();
    User_modal.fields[6].ref_model_field_name = 'code';
}
User.prototype  = Object.create(Resource.prototype);
User.prototype.constructor = User;

/**
 * add a User,
 * @param {Object} args
 * @param {String} args.user_id
 * @param {String} args.user_name
 * @param {String} args.email
 * @param {String} args.user_address
 * @param {Date} args.user_dob
 * @param {String} args.user_institute
 */
User.prototype.addUser = function(args,callback){
    if(args && args.user_id && args.user_name && args.code){
        var value = {
            user_id : args.user_id,
            user_name : args.user_name,
            user_email : args.email,
            user_address : args.user_address || '',
            user_dob : args.user_dob || '',
            code : args.code || '' 
        }
        this.create(value,function(err,result){
            if(err) return callback(err)
            return callback(null,result)
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * Update User 
 * @param {Object} args
 * @param {Object} args.args_old 
 * @param {Object} args.args_update
 */
User.prototype.updateUser = function(args,callback){
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
 * find the User with the provided code
 * @param {Object} args 
 * @param {String} args.user_id
 */
User.prototype.findUser = function(args,callback){
    if(args && args.user_id){
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
 * @param {String} args.user_id
 */
User.prototype.deleteUser = function(args,callback){
    if(args && args.user_id){
        this.delete(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

module.exports = new User();