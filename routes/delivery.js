const express = require("express");
const router = express.Router();

const DeliveryController = require("./deliveryController");

router.get("/", DeliveryController.IndexController);
router.post("/", DeliveryController.IndexPostController);
router.delete("/:id", DeliveryController.IndexDeleteController);
router.get("/charn", DeliveryController.CharnController);
router.get("/:id", DeliveryController.IndexGetByIdController);
router.put("/:id", DeliveryController.IndexUpdateController);
router.get("/charn/:id", DeliveryController.CharnByIdController);
router.post("/savePred", DeliveryController.IndexUpdateSuccessPred);
module.exports = router;
