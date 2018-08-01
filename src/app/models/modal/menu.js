var menu_def = {};
menu_def.indexes = {
    unique:[
        {
            name:'id_unique',
            fields: ['id'],
            duplication_error: 'Duplicate Menu with same id exists'
        }
    ],
}
menu_def.fields = [
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
