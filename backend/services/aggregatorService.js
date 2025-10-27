const dexService = require("./dexService");
const ethers = require("ethers");
const { RPC_URL } = require("../config/index");

const rpc_url = RPC_URL;

exports.generateTxData = async function (
  router_addr,
  amount_in,
  amount_min,
  from_token,
  to_token,
  to,
  deadline,
  chain,
) {
  const provider = new ethers.JsonRpcProvider(rpc_url);
  const path = [from_token, to_token];
  try {
    const tx_data = await dexService.generateSwapTxData(
      provider,
      router_addr,
      amount_in,
      amount_min,
      path,
      to,
      deadline,
    );
    return { status: true, body: tx_data };
  } catch (error) {
    return {
      status: false,
      body: error.message || "Failed to generate tx data",
    };
  }
};
