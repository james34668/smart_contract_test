const ethers = require("ethers");
const IUniswapV2Router = require("../abis/IUniswapRouter/IUniswapV2Router.json");
const logger = require("../utils/logger");
const { RPC_URL } = require("../config/index");

const rpc_url = RPC_URL;

exports.getBestPrice = async function (from_token, to_token, amount_in, chain) {
  let routers;
  if (chain === "mainnet") {
    routers = JSON.parse(process.env.MAINNET_ROUTERS);
  } else {
    routers = JSON.parse(process.env.SEPOLIA_ROUTERS);
  }
  const path = [from_token, to_token];
  const provider = new ethers.JsonRpcProvider(rpc_url);
  try {
    const prices = await routers.map(async (router) => {
      return await getAmountsOut(provider, router, amount_in, path);
    });
    const resolvedPrices = await Promise.all(prices);
    return { status: true, body: resolvedPrices };
  } catch (error) {
    return {
      status: false,
      body: error.message || "Failed to fetch token price",
    };
  }
};

exports.getUniswapPrice = async function (
  from_token,
  to_token,
  amount_in,
  chain,
) {
  let routers;
  if (chain === "mainnet") {
    routers = JSON.parse(process.env.MAINNET_ROUTERS);
  } else {
    routers = JSON.parse(process.env.SEPOLIA_ROUTERS);
  }
  const path = [from_token, to_token];
  const provider = new ethers.JsonRpcProvider(rpc_url);
  try {
    const price = await getAmountsOut(provider, routers[0], amount_in, path);
    return { status: true, body: price };
  } catch (error) {
    return {
      status: false,
      body: error.message || "Failed to fetch token price",
    };
  }
};

exports.getSushiswapPrice = async function (
  from_token,
  to_token,
  amount_in,
  chain,
) {
  let routers;
  if (chain === "mainnet") {
    routers = JSON.parse(process.env.MAINNET_ROUTERS);
  } else {
    routers = JSON.parse(process.env.SEPOLIA_ROUTERS);
  }
  const path = [from_token, to_token];
  const provider = new ethers.JsonRpcProvider(rpc_url);
  try {
    const price = await getAmountsOut(provider, routers[1], amount_in, path);
    return { status: true, body: price };
  } catch (error) {
    return {
      status: false,
      body: error.message || "Failed to fetch token price",
    };
  }
};

async function getAmountsOut(provider, router_address, amount_in, path) {
  const router = new ethers.Contract(
    router_address,
    IUniswapV2Router.abi,
    provider,
  );
  const result = await router.getAmountsOut(BigInt(amount_in), path);
  return await result.map((amount) => amount.toString());
}
