const API_BASE_URL = 'http://localhost:3001/api';
import ethers from 'ethers';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Auth token management
export const getAuthToken = () => localStorage.getItem('auth_token');
export const setAuthToken = (token: string) => localStorage.setItem('auth_token', token);
export const removeAuthToken = () => localStorage.removeItem('auth_token');

const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
};

// Lending API
export const lendingApi = {
  deposit: async (asset: string, amount: number, interestRate?: number) => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    return fetchWithAuth('/lend', {
      method: 'POST',
      body: JSON.stringify({ address: await signer.getAddress(), asset, amount, interest_rate: interestRate }),
    });
  },

  withdraw: async (positionId: string, amount: number) => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    return fetchWithAuth('/withdraw', {
      method: 'POST',
      body: JSON.stringify({ address: await signer.getAddress(), position_id: positionId, amount }),
    });
  },

  getPositions: async () => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    return fetchWithAuth('/positions/lending', {
      method: 'POST',
      body: JSON.stringify({ address: await signer.getAddress(), asset, amount, interest_rate: interestRate }),
    });
  },
};

// Borrowing API
export const borrowingApi = {
  borrow: async (asset: string, amount: number, collateralAmount: number, interestRate?: number) => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    return fetchWithAuth('/borrow', {
      method: 'POST',
      body: JSON.stringify({ 
        address: await signer.getAddress(), 
        asset, 
        amount, 
        collateral_amount: collateralAmount,
        interest_rate: interestRate 
      }),
    });
  },

  repay: async (positionId: string, amount: number) => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    return fetchWithAuth('/repay', {
      method: 'POST',
      body: JSON.stringify({ address: await signer.getAddress(), position_id: positionId, amount }),
    });
  },

  getPositions: async () => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    return fetchWithAuth('/positions/borrowing', {
      method: 'POST',
      body: JSON.stringify({ address: await signer.getAddress() }),
    });
  },
};

// Rates API
export const ratesApi = {
  getRates: async () => {
    return fetchWithAuth('/rates');
  },
};

// Portfolio API
export const portfolioApi = {
  getPortfolio: async () => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    return fetchWithAuth('/portfolio', {
      method: 'POST',
      body: JSON.stringify({ address: await signer.getAddress() }),
    });
  },
};
