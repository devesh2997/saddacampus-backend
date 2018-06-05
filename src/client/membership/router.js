var express = require('express');
var router = express.Router();

var controller = require('./controller');

router.post('/auth',controller.auth);

router.post('/create',controller.create_user);

router.get('/:country_code/:number', controller.send_otp);

router.post('/update/username',controller.update_username);

router.post('/update/displaypic',controller.update_displaypic);

module.exports = router;


