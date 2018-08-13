var modal = require("./../modal/food/menu_category_items_has_customisations");
var Resource = require("./../Resource");
var error_messages = require('../../config/error_messages');
var menu_customisation_modal = require('./MenuCustomization');
var items_modal = require('./MenuCategoryItems');

var ItemsCustomisation = function(items_customisation){
    Resource.call(this,"MenuCategoryItemsCustomisation","menu_category_items_has_customisations",modal);
    this.items_customisation = items_customisation;
    modal.fields[0].ref_model = items_modal.getRef();
    modal.fields[0].ref_model_field_name = 'menu_id';
    modal.fields[1].ref_model = items_modal.getRef();
    modal.fields[1].ref_model_field_name = 'category_id';
    modal.fields[2].ref_model = items_modal.getRef();
    modal.fields[2].ref_model_field_name = 'item_id';
    modal.fields[3].ref_model = menu_customisation_modal.getRef();
    modal.fields[3].ref_model_field_name = 'customisation_id';
}
ItemsCustomisation.prototype  = Object.create(Resource.prototype);
ItemsCustomisation.prototype.constructor = ItemsCustomisation;

/**
 * add a customisation to an item
 * @param {Object} args 
 * @param {String} args.menu_id
 * @param {String} args.category_id
 * @param {String} args.customisation_id
 * @param {String} args.item_id
 */
ItemsCustomisation.prototype.addItemCustomisation = function(args,callback){
    if(args && args.menu_id && args.category_id && args.item_id && args.customisation_id){
        this.items_customisation.create(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        })
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * Return the customisation id
 * @param {Object} args 
 * @param {String} args.menu_id
 * @param {String} args.category_id
 * @param {String} args.item_id 
 */
ItemsCustomisation.prototype.getItemCustomisation = function(args,callback){
    if(args.menu_id && args.category_id && args.item_id){
        this.items_customisation.get(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);       
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * Remove a customisation from the item
 * @param {Object} args 
 * @param {String} args.menu_id
 * @param {String} args.category_id
 * @param {String} args.item_id
 * @param {String} args.customisation_id 
 */
ItemsCustomisation.prototype.deleteItemCustomisation = function(args,callback){
    if(args.menu_id && args.category_id && args.item_id && args.customisation_id){
        this.items_customisation.delete(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);       
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

module.exports = new ItemsCustomisation(new ItemsCustomisation());