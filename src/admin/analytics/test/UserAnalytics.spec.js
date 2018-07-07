var assert = require('assert');
var UserAnalytics = require('./../membership/UserAnalytics');
var db = require('./../../../app/lib/sadda-db');
var User = require("./../../../app/models/User");
var moment = require("moment");

describe.only("UserAnalytics" , function(){
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
				UserAnalytics.getUserCount(function(error , result){
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
    describe("Get Total User Registered previous week" , function(){
		describe("Registered within the week" , function(){
			var res;
			before(function(done){
				testSetup(function(error){
					if(error)throw(error);
					var currentDate  = moment().subtract(2,'day').format('YYYY-MM-DD').toString();
					var query = "UPDATE "+db.tables.users.name+" SET created_at = '"+currentDate+"' WHERE number=9162728446 ";
					db.get().query(query , function(err){
						if(err)throw(err);
						UserAnalytics.previousWeekRegistered(function(error , result){
							res=result;
							done();
						});
					
					})
				});
			});
			it("correct user count is returned" , function(){
				assert.ok(res.totalUserCount === 1);
			});
			it("success is true" , function(){
				assert.ok(res.success);
			});
	
		});
		describe("Registered before the week time" , function(){
			var res;
			before(function(done){
				testSetup(function(error){
					if(error)throw(error);
					var currentDate  = moment().subtract(10,'day').format('YYYY-MM-DD').toString();
					var query = "UPDATE "+db.tables.users.name+" SET created_at = '"+currentDate+"' WHERE number=9162728446 ";
					db.get().query(query , function(err){
						if(err)throw(err);
						UserAnalytics.previousWeekRegistered(function(error , result){
							res=result;
							done();
						});
					
					})
				});
			});
			it("correct user count is returned" , function(){
				assert.ok(res.totalUserCount === 0);
			});
			it("success is true" , function(){
				assert.ok(res.success);
			});
	
		});
		
	});
	describe("Get Total User Registered previous month" , function(){
		describe("Registered within the month" , function(){
			var res;
			before(function(done){
				testSetup(function(error){
					if(error)throw(error);
					var currentDate  = moment().subtract(6,'day').format('YYYY-MM-DD').toString();
					var query = "UPDATE "+db.tables.users.name+" SET created_at = '"+currentDate+"' WHERE number=9162728446 ";
					db.get().query(query , function(err){
						if(err)throw(err);
						UserAnalytics.previousWeekRegistered(function(error , result){
							res=result;
							done();
						});
					
					})
				});
			});
			it("correct user count is returned" , function(){
				assert.ok(res.totalUserCount === 1);
			});
			it("success is true" , function(){
				assert.ok(res.success);
			});
	
		});
		describe("Registered before the week time" , function(){
			var res;
			before(function(done){
				testSetup(function(error){
					if(error)throw(error);
					var currentDate  = moment().subtract(40,'day').format('YYYY-MM-DD').toString();
					var query = "UPDATE "+db.tables.users.name+" SET created_at = '"+currentDate+"' WHERE number=9162728446 ";
					db.get().query(query , function(err){
						if(err)throw(err);
						UserAnalytics.previousWeekRegistered(function(error , result){
							res=result;
							done();
						});
					
					})
				});
			});
			it("correct user count is returned" , function(){
				assert.ok(res.totalUserCount === 0);
			});
			it("success is true" , function(){
				assert.ok(res.success);
			});
	
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


