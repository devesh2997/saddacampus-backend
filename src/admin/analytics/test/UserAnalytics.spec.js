var assert = require('assert');
var UserAnalytics = require('./../membership/UserAnalytics');
var db = require('./../../../app/lib/sadda-db');
var User = require("./../../../app/models/User")

describe.only("UserAnalytics" , function(){
    describe("Get Total User Count" , function(){
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
            User.create(args , function(){
                done();
            });
        });
        describe("get user count" , function(){
            var res = { userCount : undefined };
            var success ; 
            var err;
            before(function(done){
                    UserAnalytics.getUserCount(function(error , result){
                    err=error;
                    res.userCount = result.result[0].userCount;
                    success = result.success;
                    done();
                });
            });

            it("check for error" , function(){
                assert.ok(!err);
            });
            it("check for result" , function(){
                assert.ok(res.userCount == 1);
            });
            it("check success" , function(){
                assert.ok(success);
            });
        });
        after(function(done){
            db.drop([db.tables.users.name], function(){
                done();
            });
        });
    }); 
});


