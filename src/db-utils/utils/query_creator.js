var assert = require('assert');

/**
 * Create an insert query string
 * @param {Object} args
 * @param {String} args.table_name
 * @param {Array} args.fields
 * @param {Array} args.values
 */

exports.insert = function(args){
    assert(args.table_name, args.fields, args.values);
    var query = 'INSERT INTO '+args.table_name;

    query+=' (';
    args.fields.forEach(function(item, index){
        query+=item;
        if(index!=args.fields.length-1){
            query+=', ';
        }
    })
    query+=' ) VALUES (';

    for(var i = 0; i < args.values.length; i++){
        query+='?';
        if(i!=args.values.length-1)
            query+=',';
    }
    query+=' )';

    return query;
}

/**
 * Create a SELECT query string
 * @param {Object} args
 * @param {Array} args.fields
 * @param {String} args.table_name
 * @param {}
 */
