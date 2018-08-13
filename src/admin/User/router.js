var controllers= require('./controller');
var express = require('express');
var router = express.Router();

router.post("/UserInfo",controllers.addUserInfo);
router.get("UserInfo/:user_id",controllers.getUserInfo);
module.exports = router;