var validator = require('../../../utility/validator');
var error_messages = require('../../../config/error_messages');
var category_customisation_def = {};
category_customisation_def.indexes = {

}
category_customisation_def.fields = [
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
        name: 'customisation_id',
        type: 'string',
        isPrimary: true,
        isForeign: true,
        validator: validator.menuCustomisationIdIsValid,
        validation_error: error_messages.INVALID_MENU_CUSTOMISATION_ID,
        isCompulsory: true
    }
];
module.exports = category_customisation_def;
