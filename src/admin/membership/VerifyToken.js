var jwt = require('jsonwebtoken');
var config = require('./config/roles');
var Admin = require('../../app/models/Admin');
var error_messages = require('../../app/config/error_messages');
var Roles = require('./config/roles');

var verifyToken = function(req, res, next){
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(403).send({ success: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err)
            return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });

        Admin.findByAdminID(decoded.admin_id, function(err, result){
            if(err)
                res.status(403).send({ success: false, message: err.message });
            else if(!result.Admin)
                res.status(403).send({ success: false, message: error_messages.UNAUTHORIZED_ACCESS });
            else{
				req.Admin = result.Admin;
				next();
			}
        });
    });
};

exports.verifyToken = verifyToken;

exports.allowSuper = function (req, res, next) {
    verifyToken(req, res, function(){
        if(req.Admin.role == Roles.SUPER)
            next();
        else
            res.status(403).send({ success: false, message: error_messages.UNAUTHORIZED_ACCESS });
    });
};

exports.allowCore = function (req, res, next) {
    verifyToken(req, res, function(Admin){
        if(Admin.role == Roles.SUPER || Admin.role == Roles.CORE)
            next();
        else
            res.status(403).send({ success: false, message: error_messages.UNAUTHORIZED_ACCESS });
    });
};

exports.allowSupport = function (req, res, next) {
    verifyToken(req, res, function(Admin){
        if(Admin.role == Roles.SUPER || Admin.role == Roles.CORE || Admin.role == Roles.SUPPORT)
            next();
        else
            res.status(403).send({ success: false, message: error_messages.UNAUTHORIZED_ACCESS });
    });
};

exports.allowMaintainer = function (req, res, next) {
    verifyToken(req, res, function(Admin){
        if(Admin.role == Roles.SUPER || Admin.role == Roles.CORE || Admin.role == Roles.MAINTAINER)
            next();
        else
            res.status(403).send({ success: false, message: error_messages.UNAUTHORIZED_ACCESS });
    });
};

