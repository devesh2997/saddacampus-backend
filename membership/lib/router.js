var express = require('express');
var router = express.Router();

var controller = require('./controller');

router.post('/verify',controller.verify_otp);

router.post('/create',controller.create_user);

router.get('/:mobile', controller.send_otp);

router.post('/update/username',controller.update_username);

router.post('/update/diplaypic',controller.update_displaypic);

module.exports = router;


