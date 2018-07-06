var assert = require('assert');
var UserAnalytics = require('./../membership/UserAnalytics');
var db = require('./../../../app/lib/sadda-db');

describe("user-models" , function(){
    before(function(done){
        db.connect(db.MODE_TEST, function(){done()});
    });
    describe("get user count" , function(){
        var res = { length : undefined };
        var err;
        before(function(done){
                UserAnalytics.getUserCount(function(error , result){
                err=error;
                res.length = result.userCount;
                done();
            })
        });

        it("check for error" , function(){
            assert.ok(!err);
        });
        it("check for result" , function(){
            assert.ok(res.length != undefined);
        });
     });
    after(function(done){
            db.drop();
            done();
     });
});


