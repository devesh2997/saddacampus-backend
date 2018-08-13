var city = {};
city.indexes = {

}
city.fields = [
    {
        name: 'city_code',
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
        name: 'state_code',
        type: 'number',
        isPrimary: false,
        isForeign: false,
        isCompulsory: true
    }
]
module.exports = city;
