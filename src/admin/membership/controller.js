var Registration = require('./processes/registration');
var otp = require('../../app/lib/otp');
var jwt = require('jsonwebtoken');
var Auth = require('./processes/admin-auth');



// admin authorisation
exports.auth = function(req,res){
    var requestBody = req.body;
    var args = {
        username: requestBody.username,
        password: requestBody.password
    }
    var auth = new Auth(args);
    auth.authenticate(function(err, result){
        auth.authenticate(function(err, result){
            res.send(result);
        });
    });
}

// create new admin
exports.create = function(req, res){

}