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
	describe("Get Total User Registered previous six Days" , function(){
		describe("Registered  the previous day" , function(){
			var res;
			before(function(done){
				testSetup(function(error){
					if(error)throw(error);
					var currentDate  = moment().subtract(1,'day').format('YYYY-MM-DD hh:mm:ss').toString();
					var query = "UPDATE "+db.tables.users.name+" SET created_at = '"+currentDate+"' WHERE number=9162728446 ";
					db.get().query(query , function(err){
						if(err)throw(err);
						new UserAnalytics.getMonth().data(function(error , result){
							res=result;
							done();
						});
					})
				});
			});
			it("correct user count is returned" , function(){
				assert.ok(res.result.data[0] === 1 && res.result.data[1] === 0 );
			});
			it("success is true" , function(){
				assert.ok(res.success);
			});
		});
	
		
	});
    describe("Get Total User Registered previous week" , function(){
		describe("Registered within the week" , function(){
			var res;
			before(function(done){
				testSetup(function(error){
					if(error)throw(error);
					var currentDate  = moment().subtract(2,'day').format('YYYY-MM-DD hh:mm:ss').toString();
					var query = "UPDATE "+db.tables.users.name+" SET created_at = '"+currentDate+"' WHERE number=9162728446 ";
					db.get().query(query , function(err){
						if(err)throw(err);
						new UserAnalytics.getWeek().data(function(error , result){
							res=result;
							done();
						});
					})
				});
			});
			it("correct user count is returned" , function(){
				assert.ok(res.result.data[0] === 1 && res.result.data[1] === 0);
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
					var currentDate  = moment().subtract(10,'day').format('YYYY-MM-DD hh:mm:ss').toString();
					var query = "UPDATE "+db.tables.users.name+" SET created_at = '"+currentDate+"' WHERE number=9162728446 ";
					db.get().query(query , function(err){
						if(err)throw(err);
						new UserAnalytics.getWeek().data(function(error , result){
							res=result;
							done();
						});
					})
				});
			});
			it("correct user count is returned" , function(){
				assert.ok(res.result.data[0] === 1 && res.result.data[1] === 1 && res.result.data[2] === 0);
			});
			it("success is true" , function(){
				assert.ok(res.success);
			});
		});
		
	});
	describe("Get Total User Registered previous six months" , function(){
		describe("Registered within the last month" , function(){
			var res;
			before(function(done){
				testSetup(function(error){
					if(error)throw(error);
					var currentDate  = moment().subtract(20,'day').format('YYYY-MM-DD hh:mm:ss').toString();
					var query = "UPDATE "+db.tables.users.name+" SET created_at = '"+currentDate+"' WHERE number=9162728446 ";
					db.get().query(query , function(err){
						if(err)throw(err);
						new UserAnalytics.getMonth().data(function(error , result){
							res=result;
							done();
						});
					})
				});
			});
			it("correct user count is returned" , function(){
				assert.ok(res.result.data[0] === 1 && res.result.data[1] === 0);
			});
			it("success is true" , function(){
				assert.ok(res.success);
			});
		});
		describe("Registered before the last month time" , function(){
			var res;
			before(function(done){
				testSetup(function(error){
					if(error)throw(error);
					var currentDate  = moment().subtract(50,'day').format('YYYY-MM-DD hh:mm:ss').toString();
					var query = "UPDATE "+db.tables.users.name+" SET created_at = '"+currentDate+"' WHERE number=9162728446 ";
					db.get().query(query , function(err){
						if(err)throw(err);
						new UserAnalytics.getMonth().data(function(error , result){
							res=result;
							done();
						});
					})
				});
			});
			it("correct user count is returned" , function(){
				assert.ok(res.result.data[0] === 1 && res.result.data[1] === 1 && res.result.data[2]==0);
			});
			it("success is true" , function(){
				assert.ok(res.success);
			});
		});
		
	});
	describe("User registred between the given dates",function(){
		describe("Registered within the given period" , function(){
			var res;
			before(function(done){
				testSetup(function(error){
					if(error)throw(error);
					var registeredDate  = moment().subtract(5,'day').format('YYYY-MM-DD').toString();
					var query = "UPDATE "+db.tables.users.name+" SET created_at = '"+registeredDate+"' WHERE number=9162728446 ";
					db.get().query(query , function(err){
						if(err)throw(err);
						var args = {
							start_date :  moment().subtract(6,'day').format('YYYY-MM-DD').toString(),
							end_date : moment().format('YYYY-MM-DD').toString()
						}
						UserAnalytics.custom(args,function(error , result){
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
		describe("Registered outside the given period" , function(){
			var res;
			before(function(done){
				testSetup(function(error){
					if(error)throw(error);
					var registeredDate  = moment().subtract(15,'day').format('YYYY-MM-DD').toString();
					var query = "UPDATE "+db.tables.users.name+" SET created_at = '"+registeredDate+"' WHERE number=9162728446 ";
					db.get().query(query , function(err){
						if(err)throw(err);
						var args = {
							start_date :  moment().subtract(10,'day').format('YYYY-MM-DD').toString(),
							end_date : moment().format('YYYY-MM-DD').toString()
						}
						UserAnalytics.custom(args,function(error , result){
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
		describe("Registered without parameters" , function(){
			var res;
			before(function(done){
				testSetup(function(error){
					if(error)throw(error);
					var registeredDate  = moment().subtract(15,'day').format('YYYY-MM-DD').toString();
					var query = "UPDATE "+db.tables.users.name+" SET created_at = '"+registeredDate+"' WHERE number=9162728446 ";
					db.get().query(query , function(err){
						if(err)throw(err);
						var args = {
							start_date :  moment().subtract(10,'day').format('YYYY-MM-DD').toString()
						}
						UserAnalytics.custom(args,function(error , result){
							res=result;
							done();
						});
					})
				});
			});
			it("correct message is returned" , function(){
				assert.ok(res.message === "Required parameter/s is/are missing.");
			});
			it("success is false" , function(){
				assert.ok(!res.success);
			});
		});
	})
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


