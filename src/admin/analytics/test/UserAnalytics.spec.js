var assert = require('assert');
var UserAnalytics = require('./../membership/UserAnalytics');
var db = require('./../../../app/lib/sadda-db');
var User = require("./../../../app/models/User")

describe("UserAnalytics" , function(){
	var testSetup = function(callback){
		var args = {
			country_code : "+91",
			number : "9162728446",
			username : "akash",
			profilepic : " "
		}
		User.create(args , function(error, result){
			callback(error, result);
		});
	}
	before(function(done){
		db.connect(db.MODE_TEST, function(){
			db.drop([db.tables.users.name], function(){
				done();
			});
		});
	});
    describe("Get Total User Count" , function(){
		var res;
        before(function(done){
			testSetup(function(error){
				if(error)throw(error);
				UserAnalytics.getUserCount(function(result){
					res=result;
					done();
				});
			});
		});
		it("correct user count is returned" , function(){
			assert.ok(res.totalUserCount === 1);
		});
		it("success is true" , function(){
			assert.ok(res.success);
		});

	});
	afterEach(function(done){
		db.drop([db.tables.users.name], function(){
			done();
		});
	});
	after(function(done){
		db.drop([db.tables.users.name], function(){
			db.end();
			done();
		});
	});
});


