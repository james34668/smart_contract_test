import { BrowserProvider } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const SUPPORTED_CHAINS = {
  SEPOLIA: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia',
    rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/demo'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    }
  }
};

// Contract addresses - candidates will update these after deployment
export const CONTRACT_ADDRESSES = {
  LENDING_POOL: '0x0000000000000000000000000000000000000000', // Update after deployment
  MOCK_WETH: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
  MOCK_USDC: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
  MOCK_DAI: '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357',
  MOCK_USDT: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
  ROUTER: '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3'
};

export const ASSET_CONFIGS = {
  ETH: {
    symbol: 'ETH',
    decimals: 18,
    address: CONTRACT_ADDRESSES.MOCK_WETH
  },
  USDC: {
    symbol: 'USDC',
    decimals: 6,
    address: CONTRACT_ADDRESSES.MOCK_USDC
  },
  DAI: {
    symbol: 'DAI',
    decimals: 18,
    address: CONTRACT_ADDRESSES.MOCK_DAI
  },
  USDT: {
    symbol: 'USDT',
    decimals: 6,
    address: CONTRACT_ADDRESSES.MOCK_USDT
  }
};

export const getProvider = () => {
  if (typeof window.ethereum !== 'undefined') {
    return new BrowserProvider(window.ethereum);
  }
  throw new Error('No ethereum provider found');
};

export const requestAccounts = async () => {
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
  } catch (error) {
    console.error('Error requesting accounts:', error);
    throw error;
  }
};

export const switchToSepolia = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SUPPORTED_CHAINS.SEPOLIA.chainId }],
    });
  } catch (switchError: any) {
    // Chain doesn't exist, add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [SUPPORTED_CHAINS.SEPOLIA],
      });
    } else {
      throw switchError;
    }
  }
};
