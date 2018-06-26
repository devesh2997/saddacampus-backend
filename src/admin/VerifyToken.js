var jwt = require('jsonwebtoken');
var Admin = require('../app/models/Admin');
var error_messages = require('../app/config/error_messages');
var Roles = require('./config/roles');

var verifyToken = function(req, res, next){
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(403).send({ success: false, message: error_messages.NO_TOKEN_PROVIDED });
    jwt.verify(token, process.env.JWT_SECRET || 'mynameissaddacampus', function(err, decoded) {
        if (err)
            return res.status(500).send({ success: false, message: error_messages.TOKEN_AUTHENTICATION_FAILED });

        Admin.findByAdminID({admin_id: decoded.admin_id}, function(err, result){
            if(err)
                res.status(403).send({ success: false, message: err.message });
            else if(!result.Admin)
                return res.status(403).send({ success: false, message: error_messages.UNAUTHORIZED_ACCESS });
            else{
				req.Admin = result.Admin;
				next();
			}
        });
    });
};

exports.verifyToken = verifyToken;

exports.allowAll = function(req, res, next){
	verifyToken(req, res, function(){
		next();
    });
};

exports.allowSuper = function (req, res, next) {
    verifyToken(req, res, function(){
        if(req.Admin.role == Roles.SUPER)
            next();
        else
            res.status(403).send({ success: false, message: error_messages.UNAUTHORIZED_ACCESS });
    });
};

exports.allowCore = function (req, res, next) {
    verifyToken(req, res, function(){
        if(req.Admin.role == Roles.SUPER || Admin.role == Roles.CORE)
            next();
        else
            res.status(403).send({ success: false, message: error_messages.UNAUTHORIZED_ACCESS });
    });
};

exports.allowSupport = function (req, res, next) {
    verifyToken(req, res, function(){
        if(req.Admin.role == Roles.SUPER || req.Admin.role == Roles.CORE || req.Admin.role == Roles.SUPPORT)
            next();
        else
            res.status(403).send({ success: false, message: error_messages.UNAUTHORIZED_ACCESS });
    });
};

exports.allowMaintainer = function (req, res, next) {
    verifyToken(req, res, function(){
        if(req.Admin.role == Roles.SUPER || req.Admin.role == Roles.CORE || req.Admin.role == Roles.MAINTAINER)
            next();
        else
            res.status(403).send({ success: false, message: error_messages.UNAUTHORIZED_ACCESS });
    });
};

