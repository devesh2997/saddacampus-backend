var UserAnalytics = require("./membership/UserAnalytics");

exports.getMembershipData = function(req,res){
	
	//get users count
	UserAnalytics.getUserCount(function(error,result){
		res.send(result);
	});//semi colon missing
}
