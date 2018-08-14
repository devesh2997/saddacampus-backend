var validator = require('../../utility/validator');
var error_messages = require('../../config/error_messages');
var merchant = {};
merchant.indexes = {

}
merchant.fields = [
    {
        name: 'id',
        type: 'number',
        isPrimary: true,
        isForeign: false,
        isCompulsory: false
    },
    {
        name: 'merchant_id',
        type: 'string',
        isPrimary: true,
        isForeign: false,
        isCompulsory: true
    },
    {
        name: 'name',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        validator: validator.nameIsValid,
        validation_error: error_messages.INVALID_NAME,
        isCompulsory: true
    },
    {
        name: 'email',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        validator: validator.emailIsValid,
        validation_error: error_messages.INVALID_EMAIL,
        isCompulsory: true
    },
    {
        name: 'encrypted_password',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        validator: validator.passwordIsValid,
        validation_error: error_messages.INVALID_PASSWORD,
        isCompulsory: false
    },
    {
        name: 'country_code',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    },
    {
        name: 'number',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        validator: validator.n,
        validation_error: error_messages.INVALID_NAME,
        isCompulsory: false
    },
    {
        name: 'alternate_country_code',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    },
    {
        name: 'alternate_number',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    },
    {
        name: 'status',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    }

];
module.exports =merchant;
