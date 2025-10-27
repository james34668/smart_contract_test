const express = require("express");
const router = express.Router();
const priceController = require("../controllers/priceController");

router.post("/best-price", priceController.getBestPrice);
router.post("/uni-price", priceController.getUniPrice);
router.post("/sushi-price", priceController.getSushiPrice);

module.exports = router;
