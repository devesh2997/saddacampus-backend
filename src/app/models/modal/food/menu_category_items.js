var validator = require('../../../utility/validator');
var error_messages = require('../../../config/error_messages');
var menu_cat_items_def = {};
menu_cat_items_def.indexes = {
  
}
menu_cat_items_def.fields = [
    {
        name: 'id',
        type: 'number',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    },
    {
        name: 'menu_id',
        type: 'string',
        isPrimary: true,
        isForeign: true,
        isCompulsory: true
    },
    {
        name: 'category_id',
        type: 'string',
        isPrimary: true,
        isForeign: true,
        validator: validator.menuCategoryIdIsValid,
        validation_error: error_messages.INVALID_MENU_CATEGORY_ID,
        isCompulsory: true
    },
    {
        name: 'item_id',
        type: 'number',
        isPrimary: true,
        isForeign: false,
        isCompulsory: true
    },
    {
        name: 'name',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: true
    },
    {
        name: 'price',
        type: 'number',
        isPrimary: false,
        isForeign: false,
        isCompulsory: true
    },
    {
        name: 'description',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    },
    {
        name: 'availability',
        type: 'boolean',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    },
    {
        name: 'image',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    },
    {
        name: 'cuisine',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    },
    {
        name: 'is_non_veg',
        type: 'boolean',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    }
];
module.exports = menu_cat_items_def;