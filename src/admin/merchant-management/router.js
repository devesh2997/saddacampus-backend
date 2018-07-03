var express = require('express');
var router = express.Router();
var controller = require('./controller');
var VerifyToken = require('../VerifyToken');

router.post('/create',VerifyToken.allowCore,controller.create);

router.post('/all',VerifyToken.allowCore,controller.getAll);

router.get('/:merchantId/enable',VerifyToken.allowCore,controller.enable);

router.get('/:merchantId/disable',VerifyToken.allowCore,controller.disable);

module.exports = router;


