var get_users = require("./membership/get_user");

exports.getMembershipData = function(req,res){
	var Users  = new get_users();

	//get users count
	Users.get_user_count(function(error,result){
		res.send(result);
	}) //semi colon missing
}
