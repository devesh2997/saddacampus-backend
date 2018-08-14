var controllers= require('./controller');
var express = require('express');
var router = express.Router();

router.post("/",controllers.create);
router.get("/:user_id",controllers.get);
router.put('/',controllers.update);
router.delete('/',controllers.delete);
module.exports = router;