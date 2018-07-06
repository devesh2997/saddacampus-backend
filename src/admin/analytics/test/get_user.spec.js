var assert = require('assert');
var get_users = require('./../membership/get_user');
var db = require('./../../../app/lib/sadda-db');
var users = new get_users();


describe.only("user-models" , function(){
    before(function(done){
        db.connect(db.MODE_TEST, function(){done()});
    });
    describe("get user count" , function(){
        var res = { length : undefined };
        var err;
        before(function(done){
                users.get_user_count(function(error , result){
                err=error;
                res.length = result.length;
                done();
            })
        })

        it("check for error" , function(){
            assert.ok(!err);
        })
        it("check for result" , function(){
            assert.ok(res.length != undefined);
        })
     })
})

