var institute_business = {};
institute_business.indexes = {

}
institute_business.fields = [
    {
        name: 'code',
        type: 'string',
        isPrimary: true,
        isForeign: true,
        isCompulsory: true
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
    }
];
module.exports = institute_business;
