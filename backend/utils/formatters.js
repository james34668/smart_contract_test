exports.formatTokenAmount = (amount, decimals = 18) => {
  return (+amount / 10 ** decimals).toFixed(6);
};
