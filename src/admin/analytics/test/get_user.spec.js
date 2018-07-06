var assert = require('assert');
var UserAnalytics = require('./../membership/UserAnalytics');
var db = require('./../../../app/lib/sadda-db');
var User = require("./../../../app/models/User")

describe.only("user-models" , function(){
    before(function(done){
        db.connect(db.MODE_TEST, function(){
            db.drop([db.tables.users.name], function(){
             });
        }); 
        var args = {
            country_code : "+91",
            number : "9162728446",
            username : "akash",
            profilepic : " "
        }
        User.create(args , function(err, result ){
            done();
        });
    });
    describe("get user count" , function(){
        var res = { length : undefined };
        var err;
        before(function(done){
                UserAnalytics.getUserCount(function(error , result){
                err=error;
                res.length = result.userCount;
                done();
            });
        });

        it("check for error" , function(){
            assert.ok(!err);
        });
        it("check for result" , function(){
            assert.ok(res.length == 1);
        });
     });
    after(function(done){
        db.drop([db.tables.users.name], function(){
            done();
        });
     });
});


