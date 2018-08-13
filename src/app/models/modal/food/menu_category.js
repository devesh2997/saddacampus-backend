var validator = require('../../../utility/validator');
var error_messages = require('../../../config/error_messages');
var menu_cat_def = {};
menu_cat_def.indexes = {
  
}
menu_cat_def.fields = [
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
        isForeign: false,
        validator: validator.menuCategoryIdIsValid,
        validation_error: error_messages.INVALID_MENU_CATEGORY_ID,
        isCompulsory: true
    },
    {
        name: 'category_name',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        validator: validator.menuCategoryItemNameIsValid,
        validation_error: error_messages.INVALID_MENU_CATEGORY_ITEM_NAME,
        isCompulsory: true
    },
];
module.exports = menu_cat_def;