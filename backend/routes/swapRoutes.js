const express = require("express");
const router = express.Router();
const swapController = require("../controllers/swapController");

router.post("/gen-tx", swapController.swapTokens);

module.exports = router;
