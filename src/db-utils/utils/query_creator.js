/**
 * Create an insert query string
 * @param {Object} args
 * @param {string} args.table_name
 * @param {Array} args.fields
 * @param {Array} args.values
 */

exports.insert = function(args){
    var table_name = args.table_name;
    var fields = args.fields;
    var values = args.values;

    var query = 'INSERT INTO '+table_name;

    query+=' (';
    fields.forEach(function(item, index){
        query+=item;
        if(index!=fields.length-1){
            query+=', ';
        }
    })
    query+=' ) VALUES (';

    for(var i = 0; i < values.length; i++){
        query+='?';
        if(i!=values.length-1)
            query+=',';
    }
    query+=' )';

    return query;
}
