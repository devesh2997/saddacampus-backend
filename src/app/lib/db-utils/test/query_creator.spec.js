var assert = require('assert');
var QueryCreator = require('../utils/query_creator');

describe('Query Creator', function(){
    describe('Insert query', function(){
        var args ={};

        before(function(){
            args.table_name = 'test';
            args.fields = ['column1', 'column2', 'column3'];
            args.values = [34, 'value2', 'value3'];
        });

        it('should generate correct query', function(){
            const correctQuery = 'INSERT INTO test (column1, column2, column3) VALUES (?,?,?)';
            assert.ok(correctQuery,QueryCreator.insert(args));
        });
    });
});
