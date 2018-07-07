var UserAnalytics = require("./membership/UserAnalytics");

//get User Count
exports.getTotalUser = function(req,res){
	UserAnalytics.getUserCount(function(error , result){
		res.json(result);
	})
}

// get no of user registered previous week
exports.previousWeekRegistered = function(req,res){
	UserAnalytics.previousWeekRegistered(function(error , result){
		res.json(result);
	})
}

// get no of user registered previous month
exports.previousMonthRegistered = function(req,res){
	UserAnalytics.previousMonthRegistered(function(error , result){
		res.json(result);
	})
}