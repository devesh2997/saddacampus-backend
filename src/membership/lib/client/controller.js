var Registration = require('./processes/registration');
var otp = require('../../../app/lib/otp');


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
exports.verify_otp = function(req,res){
    otp.verifyOTP({
        country_code: req.body.country_code,
        number: req.body.number,
        otp: req.body.otp
    }).verify(function(err, result){
        res.json(result);
    });
};

//Create new user.
exports.create_user = function(req,res){
    var requestBody = req.body;
    res.json(requestBody);
    var args = {
        country_code: requestBody.country_code,
        number: requestBody.number,
        username: requestBody.username
    }
    var reg = new Registration(args);
    reg.processRegistration(function(err, result){
        res.json(result);
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