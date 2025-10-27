const ethers = require("ethers");
const dexService = require("../services/dexService");
const logger = require("../utils/logger");

exports.getUniPair = async (req, res) => {
  logger.info("get-uniswap-pair is called", req.body);
  const { factory_addr, from_token, to_token, chain } = req.body;
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST requests allowed" });
    return;
  }
  if (!factory_addr || !from_token || !to_token) {
    res.status(400).json({ error: "Token contract address required" });
    return;
  }
  const pair = await dexService.getPair(
    factory_addr,
    from_token,
    to_token,
    chain,
  );
  if (pair.status === true) {
    res.status(200).json(pair.body);
  } else {
    res.status(500).json(pair.body);
  }
};

exports.getSushiPair = async (req, res) => {
  logger.info("get-sushiswap-pair is called", req.body);
  const { factory_addr, from_token, to_token, chain } = req.body;
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST requests allowed" });
    return;
  }
  if (!factory_addr || !from_token || !to_token) {
    res.status(400).json({ error: "Token contract address required" });
    return;
  }
  const pair = await dexService.getPair(
    factory_addr,
    from_token,
    to_token,
    chain,
  );
  if (pair.status === true) {
    res.status(200).json(pair.body);
  } else {
    res.status(500).json(pair.body);
  }
};

exports.getAllPairs = async (req, res) => {
  logger.info("get-all-pairs is called", req.body);
  const { factory_addrs, from_token, to_token, chain } = req.body;
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST requests allowed" });
    return;
  }
  if (!factory_addrs || !from_token || !to_token) {
    res.status(400).json({ error: "Token contract address required" });
    return;
  }
  const uni_pair = await dexService.getPair(
    factory_addrs[0],
    from_token,
    to_token,
    chain,
  );
  const sushi_pair = await dexService.getPair(
    factory_addrs[1],
    from_token,
    to_token,
    chain,
  );
  if (uni_pair.status === true && sushi_pair.status === true) {
    res.status(200).json([uni_pair.body, sushi_pair.body]);
  } else {
    res.status(500).json([uni_pair.body, sushi_pair.body]);
  }
};
