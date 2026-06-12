const express = require("express");
const controller = require("../controllers/genericController");
const config = require("../config/entityConfig");
const router = express.Router();

if (config.listCalculationPath) {
  router.get(`${config.routePath}${config.listCalculationPath}`, controller.getListCalculation);
}
router.get(config.routePath, controller.getAll);
router.get(`${config.routePath}/:id`, controller.findById);
router.post(config.routePath, controller.create);
router.put(`${config.routePath}/:id`, controller.update);
router.delete(`${config.routePath}/:id`, controller.delete);

module.exports = router;
