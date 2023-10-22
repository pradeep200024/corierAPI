const express = require("express");
const router = express.Router();

const OrderController = require("./orderController");

router.get("/", OrderController.IndexController);
router.get("/customers", OrderController.GetAllCustomers);
router.get("/pakages", OrderController.GetAllPackages);
router.get("/:id", OrderController.IndexGetByIdController);
router.post("/", OrderController.IndexPostController);
router.delete("/:id", OrderController.IndexDeleteController);
router.put("/:id", OrderController.IndexUpdateController);

module.exports = router;
