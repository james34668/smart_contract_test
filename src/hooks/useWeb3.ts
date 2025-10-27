import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { getProvider, requestAccounts, switchToSepolia } from '@/lib/web3/config';
import { useToast } from '@/hooks/use-toast';

export const useWeb3 = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const accounts = await requestAccounts();
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        const web3Provider = getProvider();
        setProvider(web3Provider);
        
        await switchToSepolia();
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
  };

  return {
    account,
    provider,
    isConnecting,
    connectWallet,
    disconnectWallet,
    isConnected: !!account,
  };
};
