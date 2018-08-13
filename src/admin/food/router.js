var express = require('express');
var controllers = require('./controller');
var router = express.Router();

router.post('/menu',controllers.menu);
router.get("/menu/:menu_id",controllers.completeMenu);
router.post("/getMenu",controllers.getMenu);
router.post("/deleteMenu" , controllers.deleteMenu);
router.post("/menuCategory",controllers.menuCategory);
router.post("/updateMenuCategory",controllers.updateMenuCategory);
router.post("/deleteMenuCategory",controllers.deleteMenuCategory);
router.post("/findMenuCategory",controllers.getMenuCategory);
router.post("/menuCustomisation",controllers.menuCustomisation);
router.post("/findMenuCustomisation",controllers.getMenuCustomisation);
router.post("/updateMenuCustomisation",controllers.updateMenuCustomisation);
router.post("/deleteMenuCustomisation",controllers.deleteMenuCustomisation);
router.post("/menuCategoryItems",controllers.categoryItems);
router.post("/findMenuCategoryItem",controllers.findMenuCategoryItem);
router.post("/updateMenuCategoryItem",controllers.updateMenuCategoryItem);
router.post("/deleteMenuCategoryItem",controllers.deleteMenuCategoryItem);
router.post("/menuCustomisationOptions",controllers.customisationOptions);
router.post("/findMenuCustomisationOptions",controllers.findMenuCustomisationOptions);
router.post("/updateMenuCustomisationOption",controllers.updateMenuCustomisationOption);
router.post("/deleteMenuCustomisationOption",controllers.deleteMenuCustomisationOption);
router.post("/itemCustomisation",controllers.itemCustomisation);
router.post("/getItemCustomisation",controllers.getItemCustomisation);
router.post("/deleteItemCustomisation",controllers.deleteItemCustomisation);
router.post("/categoryCustomisation",controllers.categoryCustomisation);
router.post("/getCategoryCustomisation",controllers.getCategoryCustomisation);
router.post("/deleteCategoryCustomisation",controllers.deleteCategoryCustomisation);
module.exports = router;