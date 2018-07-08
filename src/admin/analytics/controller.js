var UserAnalytics = require("./membership/UserAnalytics");

//get User Count
exports.getTotalUser = function(req,res){
	UserAnalytics.getUserCount(function(error , result){
		res.json(result);
	})
}

// get no of user registered previous week
exports.previousWeeks = function(req,res){
	var week = new UserAnalytics.getWeek();
	week.data(function(error , result){
		res.json(result);
	})
}

// get no of user registered previous month
exports.previousMonths = function(req,res){
	var month = new UserAnalytics.getMonth();
	month.data(function(error , result){
		res.json(result);
	})
}

//get no of user registered between the given dates
exports.custom = function(req,res){
	var requestBody = req.body;
	var args = {
		start_date : requestBody.start_date,
		end_date : requestBody.end_date
	};
	UserAnalytics.custom(args , function(err,result){
		res.send(result);
	});
}