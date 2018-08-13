var validator = require('../../../utility/validator');
var error_messages = require('../../../config/error_messages');
var menu_custom_def = {};
menu_custom_def.indexes = {

}
menu_custom_def.fields = [
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
        isForeign: false,
        validator: validator.menuCustomisationIdIsValid,
        validation_error: error_messages.INVALID_MENU_CUSTOMISATION_ID,
        isCompulsory: true
    },
    {
        name: 'name',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        validator: validator.menuCustomisationItemNameIsValid,
        validation_error : error_messages.INVALID_MENU_CUSTOMISATION_ITEM_NAME,
        isCompulsory: true
    },
    {
        name: 'min_selections',
        type: 'number',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    },
    {
        name: 'max_selections',
        type: 'number',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    }

];
module.exports = menu_custom_def;