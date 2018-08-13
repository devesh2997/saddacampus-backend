var menu_def = {};
menu_def.indexes = {

}
menu_def.fields = [

    {
        name: 'menu_id',
        type: 'string',
        isPrimary: true,
        isForeign: false,
        isCompulsory: true
    },
    {
        name: 'description',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: false
    },
    {
        name: 'created_on',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: true
    },
    {
        name: 'updated_on',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: true
    },
];
module.exports = menu_def;
