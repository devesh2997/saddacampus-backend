var validator = require('../../utility/validator');
var error_messages = require('../../config/error_messages');
var menu_custom_options_def = {};
menu_custom_options_def.indexes = {
  
}
menu_custom_options_def.fields = [
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
        name: 'customisation_id',
        type: 'string',
        isPrimary: true,
        isForeign: true,
        validator: validator.menuCustomisationIdIsValid,
        validation_error: error_messages.INVALID_MENU_CUSTOMISATION_ID,
        isCompulsory: true
    },
    {
        name: 'customisation_option_id',
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
        name: 'is_non_veg',
        type: 'boolean',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    }
];
module.exports = menu_custom_options_def;