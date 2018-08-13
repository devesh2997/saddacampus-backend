var user_info = {};
user_info.indexes = {

}
user_info.fields = [
    {
        name: 'id',
        type: 'Number',
        isPrimary: false,
        isForeign: false,
        isCompulsory: true
    },
    {
        name: 'user_id',
        type: 'string',
        isPrimary: true,
        isForeign: false,
        isCompulsory: true
    },
    {
        name: 'user_name',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: true
    },
    {
        name: 'user_email',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    },
    {
        name: 'user_address',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    },
    {
        name: 'user_dob',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    },
    {
        name: 'code',
        type: 'string',
        isPrimary: false,
        isForeign: true,
        isCompulsory: false
    }
];
module.exports = user_info;
