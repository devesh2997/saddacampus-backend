var validator = require('../../utility/validator');
var error_messages = require('../../config/error_messages');
var restaurant = {};
restaurant.indexes = {

}
restaurant.fields = [
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
        isForeign: true,
        isCompulsory: true
    },
    {
        name: 'menu_id',
        type: 'string',
        isPrimary: true,
        isForeign: true,
        isCompulsory: true
    },
    {
        name: 'timing',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        validator: validator.restaurantTimingIsValid,
        validation_error: error_messages.RESTAURANT_TIMING_NOT_VALID,
        isCompulsory: false
    },
    {
        name: 'speciality',
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
    },
    {
        name: 'super_status',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    }

];
module.exports = restaurant;
