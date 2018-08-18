var controller = require('./controller');
var express = require('express');
var router = express.Router();

router.post('/',controller.create);

router.get('/:business_id',controller.get);

router.get('/enable/:business_id/:merchant_id',controller.enable);

router.get('/disable/:business_id/:merchant_id',controller.disable);

router.delete('/',controller.delete);

module.exports = router;