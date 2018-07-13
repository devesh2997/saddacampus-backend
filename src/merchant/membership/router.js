var express = require('express');
var router = express.Router();

var controller = require('./controller');

router.post('/auth', controller.auth);

router.post('/operator/create', controller.operatorCreate);

router.post('/operator/auth', controller.operatorAuth);

module.exports = router;
