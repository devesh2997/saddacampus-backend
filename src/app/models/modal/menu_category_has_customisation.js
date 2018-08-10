var category_customisation_def = {};
category_customisation_def.indexes = {

}
category_customisation_def.fields = [
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
        name: 'customisation_id',
        type: 'string',
        isPrimary: true,
        isForeign: true,
        isCompulsory: true
    }
];
module.exports = category_customisation_def;
