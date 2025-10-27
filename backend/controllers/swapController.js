const aggregatorService = require("../services/aggregatorService");
const logger = require("../utils/logger");

// just generate swap tx data
exports.swapTokens = async (req, res) => {
  logger.info("gen-tx-data is called");
  const {
    router_addr,
    amount_in,
    amount_min,
    from_token,
    to_token,
    to,
    deadline,
    chain,
  } = req.body;
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST requests allowed" });
    return;
  }
  if (
    !from_token ||
    !to_token ||
    !router_addr ||
    !amount_in ||
    !to ||
    !deadline
  ) {
    res.status(400).json({ error: "Token contract address required" });
    return;
  }
  const tx = await aggregatorService.generateTxData(
    router_addr,
    amount_in,
    amount_min,
    from_token,
    to_token,
    to,
    deadline,
    chain,
  );
  logger.info("gen tx data: ", tx);
  if (tx.status === true) {
    res.status(200).json(tx.body);
  } else {
    res.status(500).json(tx.body);
  }
};
