var controller = require('./controller');
var express = require('express');
var router = express.Router();

router.post('/',controller.create);
router.put('/',controller.update);
router.get('/:code',controller.get);
router.delete('/',controller.delete);

module.exports = router;