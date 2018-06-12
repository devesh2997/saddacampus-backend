var Registration = require('./processes/registration');
var Auth = require('./processes/admin-auth');



// admin authorisation
exports.auth = function(req,res){
    var requestBody = req.body;
    var args = {
        username: requestBody.username,
        password: requestBody.password
	};
	console.log(args);
    var auth = new Auth(args);
    auth.authenticate(function(err, result){
        res.send(result);
    });
};

// create new admin
exports.create = function(req, res){
	var requestBody = req.body;
	var args = {
		username: requestBody.username,
		email: requestBody.email,
		password: requestBody.password,
		role: requestBody.role
	};
	var reg = new Registration(args);
	reg.register(function(err, result){
		res.send(result);
	});
};
