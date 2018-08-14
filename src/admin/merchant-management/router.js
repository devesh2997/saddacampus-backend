var express = require('express');
var router = express.Router();
var controller = require('./controller');
var VerifyToken = require('../VerifyToken');

router.post('/',controller.create);

router.get('/:merchant_id',controller.get);

router.get('/:merchant_id/enable',controller.enable);

router.get('/:merchant_id/disable',controller.disable);

router.delete('/',controller.delete);

module.exports = router;


