var Registration = require('./processes/registration');


// Send otp for authentication
exports.send_otp = function(req,res){
    res.send('Not implemented: send otp');
};

//Verify otp sent
exports.verify_otp = function(req,res){
    res.send('Not implemented: verify otp');
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