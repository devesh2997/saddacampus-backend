var controller = require('./controller');
var express = require('express');
var router = express.Router();

router.get('/:merchant_id/:business_id/:menu_id',controller.get);
router.post('/',controller.create);
router.put('/',controller.update);
router.delete('/',controller.delete);
module.exports = router;