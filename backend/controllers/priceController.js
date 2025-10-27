const priceService = require("../services/priceService");
const logger = require("../utils/logger");

exports.getBestPrice = async (req, res) => {
  logger.info("get-best-price is called");
  const { from_token, to_token, amount_in, chain } = req.body;
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST requests allowed" });
    return;
  }
  if (!from_token || !to_token || !amount_in) {
    res.status(400).json({ error: "Token contract address required" });
    return;
  }
  const priceData = await priceService.getBestPrice(
    from_token,
    to_token,
    amount_in,
    chain,
  );
  if (priceData.status === true) {
    res.status(200).json(priceData.body);
  } else {
    res.status(500).json({ error: priceData.body });
  }
};

exports.getUniPrice = async (req, res) => {
  logger.info("get-uni-price is called");
  const { from_token, to_token, amount_in, chain } = req.body;
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST requests allowed" });
    return;
  }
  if (!from_token || !to_token || !amount_in) {
    res.status(400).json({ error: "Token contract address required" });
    return;
  }
  const priceData = await priceService.getUniswapPrice(
    from_token,
    to_token,
    amount_in,
    chain,
  );
  if (priceData.status === true) {
    res.status(200).json(priceData.body);
  } else {
    res.status(500).json({ error: priceData.body });
  }
};

exports.getSushiPrice = async (req, res) => {
  logger.info("get-uni-price is called");
  const { from_token, to_token, amount_in, chain } = req.body;
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST requests allowed" });
    return;
  }
  if (!from_token || !to_token || !amount_in) {
    res.status(400).json({ error: "Token contract address required" });
    return;
  }
  const priceData = await priceService.getSushiswapPrice(
    from_token,
    to_token,
    amount_in,
    chain,
  );
  if (priceData.status === true) {
    res.status(200).json(priceData.body);
  } else {
    res.status(500).json({ error: priceData.body });
  }
};
