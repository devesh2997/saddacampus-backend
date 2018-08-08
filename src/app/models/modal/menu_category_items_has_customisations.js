var items_customisation_def = {};
items_customisation_def.indexes = {

}
items_customisation_def.fields = [
    {
        name: 'menu_id',
        type: 'string',
        isPrimary: true,
        isForeign: true,
        isCompulsory: true
    },
    {
        name: 'category_id',
        type: 'string',
        isPrimary: true,
        isForeign: true,
        isCompulsory: true
    },
    {
        name: 'item_id',
        type: 'number',
        isPrimary: true,
        isForeign: true,
        isCompulsory: true
    },
    {
        name: 'menu_idf',
        type: 'string',
        isPrimary: false,
        isForeign: false,
        isCompulsory: true
    },
    {
        name: 'customisation_id',
        type: 'string',
        isPrimary: true,
        isForeign: true,
        isCompulsory: true
    }
];
module.exports = items_customisation_def;
