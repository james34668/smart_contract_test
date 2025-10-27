# DeFi Lending Platform - Smart Contracts

## Overview
This directory contains the Solidity smart contracts for the DeFi lending platform. These contracts need to be deployed by candidates as part of the hiring assessment.

## Contracts

### LendingPool.sol
The core lending protocol contract that handles:
- Deposits (lending)
- Withdrawals
- Borrowing with collateral
- Repayments
- Liquidations
- Interest rate calculations

## Deployment Instructions

### Prerequisites
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
```

### Setup Hardhat Project
```bash
npx hardhat init
```

### Install Dependencies
```bash
npm install @openzeppelin/contracts
```

### Deploy to Testnet (Sepolia)

1. Create a `.env` file:
```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

2. Update `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

3. Create deployment script `scripts/deploy.js`:
```javascript
const hre = require("hardhat");

async function main() {
  const LendingPool = await hre.ethers.getContractFactory("LendingPool");
  const lendingPool = await LendingPool.deploy();

  await lendingPool.deployed();

  logger.info("LendingPool deployed to:", lendingPool.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

4. Deploy:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

5. Verify contract on Etherscan:
```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

## Test Token Addresses (Sepolia)
For testing, you can use these mock ERC20 tokens on Sepolia:
- USDC: `0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8`
- DAI: `0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357`
- USDT: `0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0`

Or deploy your own mock ERC20 tokens for testing.

## Integration with Frontend
After deployment, update the contract address in:
- `src/lib/web3/config.ts` - Add your deployed contract address
- Update ABI in `src/lib/web3/abis/LendingPool.json`

## Testing
```bash
npx hardhat test
```

## Key Features to Test
1. **Deposit**: Users can deposit ERC20 tokens to earn interest
2. **Withdraw**: Users can withdraw deposits + interest
3. **Borrow**: Users can borrow against ETH collateral (150% ratio)
4. **Repay**: Users can repay borrowed amount + interest
5. **Liquidation**: Undercollateralized positions can be liquidated
6. **Interest Rates**: Dynamic rates based on utilization

## Security Considerations
- ReentrancyGuard protection on all state-changing functions
- Proper access control
- Overflow protection (Solidity 0.8+)
- Collateralization checks
- Health factor monitoring

## Assessment Criteria
Candidates will be evaluated on:
1. Successfully deploying the contract to testnet
2. Integrating with the React frontend
3. Testing all core functions
4. Understanding of DeFi mechanics
5. Code quality and testing
