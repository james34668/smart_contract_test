const express = require("express");
const router = express.Router();
const liquidityController = require("../controllers/liquidityController");

router.post("/all-pairs", liquidityController.getAllPairs);
router.post("/uni-pair", liquidityController.getUniPair);
router.post("/sushi-pair", liquidityController.getSushiPair);

module.exports = router;
