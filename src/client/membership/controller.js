var Registration = require('./processes/registration');
var otp = require('../../app/lib/otp');
var jwt = require('jsonwebtoken');
var Auth = require('./processes/auth');
var UsernameAvailability = require('./processes/username-availability');



// Send otp for authentication
exports.send_otp = function(req,res){
    otp.sendOTP({
        country_code: req.params.country_code,
        number: req.params.number
    }).send(function(err, result){
        res.json(result);
    });
};

//Verify otp sent
exports.auth = function(req,res){
    var requestBody = req.body;
    var args = {
        country_code: requestBody.country_code,
        number: requestBody.number,
        otp: requestBody.otp
    }
    var auth = new Auth(args);
    auth.authenticate(function(err, result){
        res.send(result);
    });
};

//check username availability
exports.check_username_availability = function(req, res){
    UsernameAvailability.isUsernameAvailable(req.params.username, function(err, isAvailable){
        var response = {};
        if(err){
            response.success = false;
            response.message = err.message;
        }else{
            response.success = true;
            response.isAvailable = isAvailable;
        }
        res.send(response);
    });
}

//Create new user.
exports.create_user = function(req,res){
    var requestBody = req.body;
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ success: false, message: 'No token provided.' });
    jwt.verify(token, process.env.JWT_SECRET || 'mynameissaddacampus', function(err, decoded){
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if(decoded.country_code !== requestBody.country_code || decoded.number !== requestBody.number){
            return res.status(500).send({ auth: false, message: 'Invalid authentication token.' });
        }else{
            var args = {
                country_code: requestBody.country_code,
                number: requestBody.number,
                username: requestBody.username,
                profilepic: requestBody.profilepic
            }
            var reg = new Registration(args);
            reg.register(function(err, result){
                res.json(result);
            });
        }
    });
    
};

//Update username.
exports.update_username = function(req,res){
    res.send('Not implemented: update username');
};

//Update display pic.
exports.update_displaypic = function(req,res){
    res.send('Not implemented: update display pic');
};