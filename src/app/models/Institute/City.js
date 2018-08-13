var error_messages = require('../../config/error_messages');
var Resource = require("./../Resource");
var city_modal = require('./../modal/City');
var state = require('./State');
var _ = require('underscore');

var City= function(city){
    Resource.call(this,'City','cities',city_modal);
    this.city = city;
    city_modal.fields[2].ref_model = state.getRef();
    city_modal.fields[2].ref_model_field_name = 'state_code';
}
City.prototype  = Object.create(Resource.prototype);
City.prototype.constructor = City;

/**
 * add categories to menu,
 * @param {Object} args
 * @param {Number} args.state_code
 * @param {String} args.name
 * @param {Number} args.city
 */
City.prototype.addCity = function(args,callback){
    if(args && args.name && args.state_code){
        this.city.create(args,function(err,result){
            if(err) return callback(err)
            return callback(null,result)
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * Update City 
 * @param {Object} args
 * @param {Object} args.args_old 
 * @param {Object} args.args_update
 */
City.prototype.updateCity = function(args,callback){
    if(args && !_.isEmpty(args.args_old) && !_.isEmpty(args.args_update)){
        this.city.update({args_set : args.args_update, args_where : args.args_old},function(err,result){
            if(err) return callback(err)
            return callback(null,result)
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * find the City with the provided code
 * @param {Object} args 
 * @param {String} args.city_code
 */
City.prototype.findCity = function(args,callback){
    if(args && args.city_code ){
        this.city.get(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * Delete City
 * returns {affectedRows}
 * @param {Object} args
 * @param {String} args.city_code
 */
 City.prototype.deleteCity = function(args,callback){
    if(args && args.city_code){
        this.city.delete(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

module.exports = new City(new City());