var Log = require('../log');
var sinon = require('sinon');

describe('Log',function(){
    describe('.e',function(){
        it('should only pass error_message to query given to db.query()',function(){
            var error_message = 'test';

            var query = sinon.stub(db)
        })
    });
});
