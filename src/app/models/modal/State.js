var state = {};
state.indexes = {

}
state.fields = [
    {
        name: 'state_code',
        type: 'Number',
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
    }
]
module.exports = state;
