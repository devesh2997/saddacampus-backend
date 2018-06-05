var express = require('express');
var router = express.Router();

var controller = require('./controller');

router.post('/auth',controller.auth);

router.post('/create',controller.create_admin);

module.exports = router;


