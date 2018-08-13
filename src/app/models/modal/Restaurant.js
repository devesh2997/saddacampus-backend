var restaurant = {};
restaurant.indexes = {

}
restaurant.fields = [
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