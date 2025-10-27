require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3001,
  MONGO_URI: process.env.MONGO_URI,
  RPC_URL: process.env.RPC_URL,
  API_KEYS: {
    oneInch: process.env.ONEINCH_API_KEY,
  },
  LOGGER_LEVEL: process.env.LOGGER_LEVEL || "error",
};
