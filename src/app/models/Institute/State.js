var error_messages = require('../../config/error_messages');
var Resource = require("./../Resource");
var State_modal = require('./../modal/State')
var _ = require('underscore');

var State= function(){
    Resource.call(this,'States','states',State_modal);
}
State.prototype  = Object.create(Resource.prototype);
State.prototype.constructor = State;

/**
 * add a ew State,
 * @param {Object} args
 * @param {String} args.name
 */
State.prototype.addState = function(args,callback){
    if(args && args.name){
        this.create(args,function(err,result){
            if(err) return callback(err)
            return callback(null,result)
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * Update State 
 * @param {Object} args
 * @param {Object} args.args_old 
 * @param {Object} args.args_update
 */
State.prototype.updateState = function(args,callback){
    if(args && !_.isEmpty(args.args_old) && !_.isEmpty(args.args_update)){
        this.update({args_set : args.args_update, args_where : args.args_old},function(err,result){
            if(err) return callback(err)
            return callback(null,result)
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * find the State with the provided code
 * @param {Object} args 
 * @param {String} args.name
 * @param {String} args.state_code
 */
State.prototype.findState = function(args,callback){
    if(args && (args.state_code||args.name) ){
        this.get(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * Delete State
 * returns {affectedRows}
 * @param {Object} args
 * @param {String} args.state_code
 * @param {String} args.name
 */
State.prototype.deleteState = function(args,callback){
    if(args && (args.state_code||args.name)){
        this.delete(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

module.exports = new State();