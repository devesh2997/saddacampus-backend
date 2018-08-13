var validator = require('../../utility/validator');
var error_messages = require('../../config/error_messages');
var institute = {};
institute.indexes = {

}
institute.fields = [
    {
        name: 'id',
        type: 'Number',
        isPrimary: false,
        isForeign: false,
        isCompulsory: true
    },
    {
        name: 'code',
        type: 'string',
        isPrimary: true,
        isForeign: false,
        validator: validator.instituteCodeIsValid,
        validation_error: error_messages.INVALID_INSTITUTE_CODE,
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
        name: 'city_code',
        type: 'number',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    },
];
module.exports = institute;
