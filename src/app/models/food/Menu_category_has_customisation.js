var modal = require("./../modal/food/menu_category_has_customisation");
var Resource = require("./../Resource");
var error_messages = require('../../config/error_messages');
var menu_customisation_modal = require('./MenuCustomization');
var menu_customisation_option_modal = require('./MenuCustomizationOptions')
var items_modal = require('./MenuCategory');

var CategoryCustomisation = function(){
    Resource.call(this,"MenuCategoryCustomisation","menu_categories_has_customisations",modal);
    modal.fields[0].ref_model = items_modal.getRef();
    modal.fields[0].ref_model_field_name = 'menu_id';
    modal.fields[1].ref_model = items_modal.getRef();
    modal.fields[1].ref_model_field_name = 'category_id';
    modal.fields[2].ref_model = menu_customisation_modal.getRef();
    modal.fields[2].ref_model_field_name = 'customisation_id';
}
CategoryCustomisation.prototype  = Object.create(Resource.prototype);
CategoryCustomisation.prototype.constructor = CategoryCustomisation;

/**
 * Add a customisation to a category
 * @param {Object} args 
 * @param {String} args.menu_id
 * @param {String} args.category_id
 * @param {String} args.customisation_id 
 */
CategoryCustomisation.prototype.addCategoryCustomisation = function(args,callback){
    if(args && args.menu_id && args.category_id && args.customisation_id){
        this.create(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);
        })
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * Return the complete Customisation list for the given category
 * @param {Object} args 
 * @param {String} args.menu_id
 * @param {String} args.category_id 
 */
CategoryCustomisation.prototype.getCategoryCustomisation = function(args,callback){
    if(args.menu_id && args.category_id){
        this.get(args,function(err,result){
            if(err) return callback(err);
            var count = 0;
            if(result.length == 0) return callback(null,[])
            else{
                result.forEach(element => {
                    menu_customisation_option_modal.findCompleteOptions({menu_id : element.menu_id , customisation_id : element.customisation_id},function(err,res){
                        if(err) return callback(err);
                        count++;
                        element["customisation"] = res[0];
                        if(count == result.length) return callback(null,result)
                    });
                });
            }
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

/**
 * Remove a customisation from the category 
 * @param {Object} args 
 * @param {String} args.menu_id
 * @param {String} args.category_id
 * @param {String} args.customisation_id 
 */
CategoryCustomisation.prototype.deleteCategoryCustomisation = function(args,callback){
    if(args.menu_id && args.category_id && args.customisation_id){
        this.delete(args,function(err,result){
            if(err) return callback(err);
            return callback(null,result);       
        });
    } else {
        return callback(new Error(error_messages.MISSING_PARAMETERS));
    }
}

module.exports = new CategoryCustomisation(new CategoryCustomisation());