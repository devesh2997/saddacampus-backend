var express = require('express');
var controllers = require('./controllers');
var router = express.Router();

router.post('/menu',controllers.menu);
router.post("/getMenu",controllers.getMenu);
router.post("/deleteMenu" , controllers.deleteMenu);
router.post("/menuCategory",controllers.menuCategory);
router.post("/updateMenuCategory",controllers.menuCategoryUpdate);
router.post("/deleteMenuCategory",controllers.menuCategoryDelete);
router.post("/findMenuCategory",controllers.getMenuCategory);
router.post("/menuCustomisation",controllers.menuCustomisation);
router.post("/findMenuCustomisation",controllers.getMenuCustomisation);
router.post("/updateMenuCustomisation",controllers.menuCustomisationUpdate);
router.post("/deleteMenuCustomisation",controllers.menuCustomisationDelete);

module.exports = router;