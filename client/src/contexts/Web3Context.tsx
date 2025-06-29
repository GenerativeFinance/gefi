import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

// Supported chains configuration
export const SUPPORTED_CHAINS = {
  1: {
    name: 'Ethereum',
    symbol: 'ETH',
    rpc: 'https://mainnet.infura.io/v3/',
    explorer: 'https://etherscan.io',
    color: '#627EEA'
  },
  56: {
    name: 'BSC',
    symbol: 'BNB',
    rpc: 'https://bsc-dataseed.binance.org/',
    explorer: 'https://bscscan.com',
    color: '#F3BA2F'
  },
  137: {
    name: 'Polygon',
    symbol: 'MATIC',
    rpc: 'https://polygon-rpc.com/',
    explorer: 'https://polygonscan.com',
    color: '#8247E5'
  },
  43114: {
    name: 'Avalanche',
    symbol: 'AVAX',
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    explorer: 'https://snowtrace.io',
    color: '#E84142'
  },
  250: {
    name: 'Fantom',
    symbol: 'FTM',
    rpc: 'https://rpc.ftm.tools/',
    explorer: 'https://ftmscan.com',
    color: '#1969FF'
  }
};

export interface Web3State {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  balance: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
}

export interface Web3ContextType extends Web3State {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchChain: (chainId: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [state, setState] = useState<Web3State>({
    isConnected: false,
    account: null,
    chainId: null,
    balance: null,
    provider: null,
    signer: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await initializeProvider(accounts[0]);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const initializeProvider = async (account: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(account);

      setState({
        isConnected: true,
        account,
        chainId: Number(network.chainId),
        balance: ethers.formatEther(balance),
        provider,
        signer,
      });
    } catch (error) {
      console.error('Error initializing provider:', error);
      setError('Failed to initialize Web3 provider');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        await initializeProvider(accounts[0]);
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        setError('Connection rejected by user');
      } else {
        setError('Failed to connect wallet');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setState({
      isConnected: false,
      account: null,
      chainId: null,
      balance: null,
      provider: null,
      signer: null,
    });
    setError(null);
  };

  const switchChain = async (chainId: number) => {
    if (!window.ethereum) return;

    const chainHex = `0x${chainId.toString(16)}`;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainHex }],
      });
    } catch (error: any) {
      // Chain not added to wallet
      if (error.code === 4902) {
        const chainConfig = SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS];
        if (chainConfig) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: chainHex,
                chainName: chainConfig.name,
                nativeCurrency: {
                  name: chainConfig.name,
                  symbol: chainConfig.symbol,
                  decimals: 18,
                },
                rpcUrls: [chainConfig.rpc],
                blockExplorerUrls: [chainConfig.explorer],
              }],
            });
          } catch (addError) {
            console.error('Error adding chain:', addError);
            setError(`Failed to add ${chainConfig.name} network`);
          }
        }
      } else {
        console.error('Error switching chain:', error);
        setError('Failed to switch network');
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else if (accounts[0] !== state.account) {
      initializeProvider(accounts[0]);
    }
  };

  const handleChainChanged = (chainId: string) => {
    // Refresh the page to avoid state inconsistencies
    window.location.reload();
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const contextValue: Web3ContextType = {
    ...state,
    connectWallet,
    disconnectWallet,
    switchChain,
    isLoading,
    error,
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}