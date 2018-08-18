var validator = require('../../utility/validator');
var error_messages = require('../../config/error_messages');
var business = {};
business.indexes = {

}
business.fields = [
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
        isForeign: true,
        isCompulsory: true
    },
    {
        name: 'business_id',
        type: 'string',
        isPrimary: true,
        isForeign: false,
        validator: validator.businessIdIsValid,
        validation_error: error_messages.BUSINESS_DOES_NOT_EXIST,
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
        name: 'address',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: true
    },
    {
        name: 'type',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    },
    {
        name: 'gstin',
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
        validator: validator.businessStatusIsValid,
        validation_error: error_messages.BUSINESS_STATUS_NOT_VALID,
        isCompulsory: false
    }
];
module.exports =business;
