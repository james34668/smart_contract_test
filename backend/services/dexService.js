const ethers = require("ethers");
const IUniswapV2Factory = require("../abis/IUniswapFactory/IUniswapV2Factory.json");
const IUniswapV2Router = require("../abis/IUniswapRouter/IUniswapV2Router.json");
const logger = require("../utils/logger");
const { RPC_URL } = require("../config/index");

const rpc_url = RPC_URL;

exports.getPair = async function (factory_addr, from_token, to_token, chain) {
  const provider = new ethers.JsonRpcProvider(rpc_url);
  try {
    const pair = await getUniswapPair(
      provider,
      factory_addr,
      from_token,
      to_token,
    );
    return { status: true, body: pair };
  } catch (error) {
    return {
      status: false,
      body: error.message || "Failed to get uniswap pair",
    };
  }
};
exports.generateSwapTxData = async function (
  provider,
  routerAddress,
  amountIn,
  amountOutMin,
  path,
  to,
  deadline,
) {
  const router = new ethers.Contract(
    routerAddress,
    IUniswapV2Router.abi,
    provider,
  );
  const data = router.interface.encodeFunctionData(
    "swapExactTokensForTokensSupportingFeeOnTransferTokens",
    [BigInt(amountIn), BigInt(amountOutMin), path, to, BigInt(deadline)],
  );
  const tx = {
    to: routerAddress,
    data: data,
    // value: 0n, // Only needed if sending ETH
    // gasLimit: 300_000n, // Optional: estimate or set
    // maxFeePerGas, maxPriorityFeePerGas, nonce, etc.
  };
  logger.info("generated tx:", tx);
  return tx;
};

async function getUniswapPair(provider, factory_addr, from_token, to_token) {
  const factory = new ethers.Contract(
    factory_addr,
    IUniswapV2Factory.abi,
    provider,
  );
  const result = await factory.getPair(from_token, to_token);
  return result.toString();
}
