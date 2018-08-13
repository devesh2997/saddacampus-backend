var validator = require('../../../utility/validator');
var error_messages = require('../../../config/error_messages');
var items_customisation_def = {};
items_customisation_def.indexes = {

}
items_customisation_def.fields = [
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
        isForeign: true,
        isCompulsory: true
    },
    {
        name: 'customisation_id',
        type: 'string',
        isPrimary: true,
        isForeign: true,
        validator: validator.menuCustomisationIdIsValid,
        validation_error: error_messages.INVALID_MENU_CUSTOMISATION_ID,
        isCompulsory: true
    }
];
module.exports = items_customisation_def;
