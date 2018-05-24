var Log = require('../log');
var sinon = require('sinon');
var db = require('../../sadda-db');

describe('Log',function(){
    before(function(){
        db.connect(db.MODE_TEST,function(err) {
            if (err) {
              console.log('Unable to connect to MySQL.');
              process.exit(1);
            }
        });
    })
    describe('.e',function(){
        it('should only pass error_message to query given to db.query()',function(){
            var error_message = 'test';

            Log.e(error_message);
        });
    });
});
