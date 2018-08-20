var express = require('express');
var controllers = require('./controller');
var router = express.Router();

router.get("/:menu_id",controllers.completeMenu);

router.post('/menu',controllers.menu);
router.get("/menu/:menu_id",controllers.getMenu);
router.delete("/menu" , controllers.deleteMenu);

router.post("/menuCategory",controllers.menuCategory);
router.put("/menuCategory",controllers.updateMenuCategory);
router.delete("/menuCategory",controllers.deleteMenuCategory);
router.post("/findMenuCategory",controllers.getMenuCategory);

router.post("/menuCustomisation",controllers.menuCustomisation);
router.post("/findMenuCustomisation",controllers.getMenuCustomisation);
router.put("/menuCustomisation",controllers.updateMenuCustomisation);
router.delete("/menuCustomisation",controllers.deleteMenuCustomisation);

router.post("/menuCategoryItems",controllers.categoryItems);
router.post("/findMenuCategoryItem",controllers.findMenuCategoryItem);
router.put("/menuCategoryItem",controllers.updateMenuCategoryItem);
router.delete("/menuCategoryItem",controllers.deleteMenuCategoryItem);

router.post("/menuCustomisationOptions",controllers.customisationOptions);
router.post("/findMenuCustomisationOptions",controllers.findMenuCustomisationOptions);
router.put("/menuCustomisationOption",controllers.updateMenuCustomisationOption);
router.delete("/menuCustomisationOption",controllers.deleteMenuCustomisationOption);

router.post("/itemCustomisation",controllers.itemCustomisation);
router.post("/getItemCustomisation",controllers.getItemCustomisation);
router.delete("/itemCustomisation",controllers.deleteItemCustomisation);

router.post("/categoryCustomisation",controllers.categoryCustomisation);
router.post("/getCategoryCustomisation",controllers.getCategoryCustomisation);
router.delete("/categoryCustomisation",controllers.deleteCategoryCustomisation);

module.exports = router;