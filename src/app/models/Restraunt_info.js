var error_messages = require('../config/error_messages');
var Resource = require("./Resource");
var restaurant_modal = require('./modal/Institue');
var _ = require('underscore');
var menu = require("./food/Menu");

var Restaurant = function(restaurant){
    Resource.call(this,'Restaurant','restaurant_info',restaurant_modal);
    this.restaurant = restaurant;
    restaurant_modal.fields[2].ref_model = menu.getRef();
    restaurant_modal.fields[2].ref_model_field_name = 'menu_id';
}
Restaurant.prototype  = Object.create(Resource.prototype);
Restaurant.prototype.constructor = Restaurant;

/**
 * add a restaurant,
 * @param {Object} args
 * @param {String} args.merchant_id
 * @param {String} args.business_id
 * @param {String} args.menu_id
 * @param {String} args.timing
 * @param {String} args.speciality
 * @param {String} args.status
 * @param {String} args.super_status
 */
Restaurant.prototype.addRestaurant = function(args,callback){
    if(args && args.merchant_id && args.business_id && args.menu_id){
        var value = {
            merchant_id : args.merchant_id,
            business_id : args.business_id,
            menu_id : args.menu_id,
            timing : args.timing || '',
            speciality : args.speciality || '',
            status : args.status || 'closed',
            super_status : args.super_status || 'closed'
        }
        this.restaurant.create(value,function(err,result){
            if(err) return callback(err)
            return callback(null,result)
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * Update Restaurant 
 * @param {Object} args
 * @param {Object} args.args_old 
 * @param {Object} args.args_update
 */
Restaurant.prototype.updateRestaurant = function(args,callback){
    if(args && !_.isEmpty(args.args_old) && !_.isEmpty(args.args_update)){
        this.Restaurant.update({args_set : args.args_update, args_where : args.args_old},function(err,result){
            if(err) return callback(err)
            return callback(null,result)
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * find the Restaurant with the provided code
 * @param {Object} args 
 * @param {String} args.merchant_id
 * @param {String} args.business_id
 */
Restaurant.prototype.findRestaurant = function(args,callback){
    if(args && args.merchant_id && args.business_id ){
        this.institue.get(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * @param {Object} args
 * @param {String} args.merchant_id
 * @param {String} args.business_id
 */
Restaurant.prototype.deleteRestaurant = function(args,callback){
    if(args && args.merchant_id && args.business_id){
        this.Restaurant.delete(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

module.exports = new Restaurant(new Restaurant());