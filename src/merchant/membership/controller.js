var Auth = require("./processes/auth");

//merchant authentication
exports.auth = function(req, res){
	var requestBody = req.body;
    var args = {
		email: requestBody.email,
		password: requestBody.password
	}
	
    var auth = new Auth(args);
    auth.authenticate(function(err, result){
        res.send(result);
    });
};

//creating new operator
exports.operatorCreate = function(req, res){

};

//operator authentication
exports.operatorAuth = function(req, res){

};
