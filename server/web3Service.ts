import { ethers } from 'ethers';
import Web3 from 'web3';

// Chain configurations
export const SUPPORTED_CHAINS = {
  1: {
    name: 'Ethereum',
    symbol: 'ETH',
    rpc: 'https://mainnet.infura.io/v3/',
    explorer: 'https://etherscan.io',
    coingeckoId: 'ethereum'
  },
  56: {
    name: 'BSC',
    symbol: 'BNB',
    rpc: 'https://bsc-dataseed.binance.org/',
    explorer: 'https://bscscan.com',
    coingeckoId: 'binancecoin'
  },
  137: {
    name: 'Polygon',
    symbol: 'MATIC',
    rpc: 'https://polygon-rpc.com/',
    explorer: 'https://polygonscan.com',
    coingeckoId: 'matic-network'
  },
  43114: {
    name: 'Avalanche',
    symbol: 'AVAX',
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    explorer: 'https://snowtrace.io',
    coingeckoId: 'avalanche-2'
  },
  250: {
    name: 'Fantom',
    symbol: 'FTM',
    rpc: 'https://rpc.ftm.tools/',
    explorer: 'https://ftmscan.com',
    coingeckoId: 'fantom'
  }
};

// ERC-20 Token ABI (minimal)
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)'
];

// Common DeFi Protocol ABIs
const UNISWAP_V2_PAIR_ABI = [
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function token0() view returns (address)',
  'function token1() view returns (address)',
  'function totalSupply() view returns (uint256)'
];

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  usdValue?: number;
}

export interface WalletPortfolio {
  totalValue: number;
  nativeBalance: string;
  tokens: TokenInfo[];
  defiPositions: DefiPosition[];
  nfts: NFTInfo[];
}

export interface DefiPosition {
  protocol: string;
  type: 'liquidity' | 'lending' | 'borrowing' | 'staking';
  tokenPair?: string;
  principal: string;
  currentValue: string;
  rewards: string;
  apy?: number;
}

export interface NFTInfo {
  contractAddress: string;
  tokenId: string;
  name: string;
  imageUrl?: string;
  collectionName: string;
  floorPrice?: number;
}

export class Web3Service {
  private providers: Map<number, ethers.JsonRpcProvider> = new Map();
  private web3Instances: Map<number, Web3> = new Map();

  constructor() {
    // Initialize providers for supported chains
    Object.entries(SUPPORTED_CHAINS).forEach(([chainId, config]) => {
      const provider = new ethers.JsonRpcProvider(config.rpc);
      this.providers.set(parseInt(chainId), provider);
      
      const web3 = new Web3(config.rpc);
      this.web3Instances.set(parseInt(chainId), web3);
    });
  }

  // Get provider for a specific chain
  getProvider(chainId: number): ethers.JsonRpcProvider | null {
    return this.providers.get(chainId) || null;
  }

  // Get Web3 instance for a specific chain
  getWeb3(chainId: number): Web3 | null {
    return this.web3Instances.get(chainId) || null;
  }

  // Validate wallet address
  isValidAddress(address: string): boolean {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  }

  // Get native token balance (ETH, BNB, etc.)
  async getNativeBalance(address: string, chainId: number): Promise<string> {
    try {
      const provider = this.getProvider(chainId);
      if (!provider) throw new Error(`Unsupported chain ID: ${chainId}`);

      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting native balance:', error);
      throw error;
    }
  }

  // Get ERC-20 token balance
  async getTokenBalance(address: string, tokenAddress: string, chainId: number): Promise<TokenInfo> {
    try {
      const provider = this.getProvider(chainId);
      if (!provider) throw new Error(`Unsupported chain ID: ${chainId}`);

      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      
      const [balance, decimals, symbol, name] = await Promise.all([
        contract.balanceOf(address),
        contract.decimals(),
        contract.symbol(),
        contract.name()
      ]);

      const formattedBalance = ethers.formatUnits(balance, decimals);

      return {
        address: tokenAddress,
        symbol,
        name,
        decimals,
        balance: formattedBalance
      };
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  }

  // Get comprehensive wallet portfolio
  async getWalletPortfolio(address: string, chainId: number): Promise<WalletPortfolio> {
    try {
      // Get native balance
      const nativeBalance = await this.getNativeBalance(address, chainId);
      
      // For demo purposes, we'll get some common tokens
      const commonTokens = await this.getCommonTokens(address, chainId);
      
      // Get DeFi positions (this would integrate with various protocols)
      const defiPositions = await this.getDefiPositions(address, chainId);
      
      // Get NFTs (basic implementation)
      const nfts = await this.getNFTs(address, chainId);

      // Calculate total value (would integrate with price APIs)
      const totalValue = await this.calculatePortfolioValue(nativeBalance, commonTokens, chainId);

      return {
        totalValue,
        nativeBalance,
        tokens: commonTokens,
        defiPositions,
        nfts
      };
    } catch (error) {
      console.error('Error getting wallet portfolio:', error);
      throw error;
    }
  }

  // Get common tokens for a wallet
  private async getCommonTokens(address: string, chainId: number): Promise<TokenInfo[]> {
    const commonTokenAddresses = this.getCommonTokenAddresses(chainId);
    const tokens: TokenInfo[] = [];

    for (const tokenAddress of commonTokenAddresses) {
      try {
        const tokenInfo = await this.getTokenBalance(address, tokenAddress, chainId);
        if (parseFloat(tokenInfo.balance) > 0) {
          tokens.push(tokenInfo);
        }
      } catch (error) {
        console.error(`Error getting balance for token ${tokenAddress}:`, error);
      }
    }

    return tokens;
  }

  // Get common token addresses for each chain
  private getCommonTokenAddresses(chainId: number): string[] {
    const tokenAddresses: { [key: number]: string[] } = {
      1: [ // Ethereum
        '0xA0b86a33E6441b95C4CEA1fBED8a91d1d6B2C02B', // USDC
        '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
        '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
        '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
      ],
      56: [ // BSC
        '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // USDC
        '0x55d398326f99059fF775485246999027B3197955', // USDT
        '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', // DAI
      ],
      137: [ // Polygon
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', // DAI
      ]
    };

    return tokenAddresses[chainId] || [];
  }

  // Get DeFi positions (simplified implementation)
  private async getDefiPositions(address: string, chainId: number): Promise<DefiPosition[]> {
    // This would integrate with various DeFi protocols
    // For now, return empty array
    return [];
  }

  // Get NFTs (simplified implementation)
  private async getNFTs(address: string, chainId: number): Promise<NFTInfo[]> {
    // This would integrate with NFT marketplaces and metadata services
    // For now, return empty array
    return [];
  }

  // Calculate portfolio value
  private async calculatePortfolioValue(nativeBalance: string, tokens: TokenInfo[], chainId: number): Promise<number> {
    // This would integrate with price APIs like CoinGecko
    // For now, return a simple calculation
    let totalValue = 0;
    
    // Add native token value (simplified)
    const nativePrice = await this.getTokenPrice(SUPPORTED_CHAINS[chainId].coingeckoId);
    totalValue += parseFloat(nativeBalance) * nativePrice;

    // Add token values (would need token prices)
    for (const token of tokens) {
      // Simplified: assume $1 for stablecoins
      if (['USDC', 'USDT', 'DAI'].includes(token.symbol)) {
        totalValue += parseFloat(token.balance);
      }
    }

    return totalValue;
  }

  // Get token price from CoinGecko (placeholder)
  private async getTokenPrice(coingeckoId: string): Promise<number> {
    try {
      // This would make actual API calls to CoinGecko
      // For now, return mock prices
      const mockPrices: { [key: string]: number } = {
        'ethereum': 2000,
        'binancecoin': 300,
        'matic-network': 0.8,
        'avalanche-2': 25,
        'fantom': 0.3
      };
      
      return mockPrices[coingeckoId] || 1;
    } catch (error) {
      console.error('Error getting token price:', error);
      return 0;
    }
  }

  // Get transaction history
  async getTransactionHistory(address: string, chainId: number, limit: number = 10): Promise<any[]> {
    try {
      const provider = this.getProvider(chainId);
      if (!provider) throw new Error(`Unsupported chain ID: ${chainId}`);

      // Get latest block number
      const latestBlock = await provider.getBlockNumber();
      const transactions = [];

      // Get recent transactions (simplified)
      for (let i = 0; i < Math.min(limit, 100); i++) {
        try {
          const block = await provider.getBlock(latestBlock - i, true);
          if (block && block.transactions) {
            const userTxs = block.transactions.filter((tx: any) => 
              tx.to === address || tx.from === address
            );
            transactions.push(...userTxs);
            
            if (transactions.length >= limit) break;
          }
        } catch (error) {
          console.error(`Error getting block ${latestBlock - i}:`, error);
        }
      }

      return transactions.slice(0, limit);
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw error;
    }
  }

  // Estimate gas price
  async getGasPrice(chainId: number): Promise<string> {
    try {
      const provider = this.getProvider(chainId);
      if (!provider) throw new Error(`Unsupported chain ID: ${chainId}`);

      const gasPrice = await provider.getFeeData();
      return ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei');
    } catch (error) {
      console.error('Error getting gas price:', error);
      throw error;
    }
  }

  // Get DeFi protocol TVL and APY data
  async getDefiProtocolData(protocol: string, chainId: number): Promise<any> {
    // This would integrate with DeFi pulse, DeBank, or protocol-specific APIs
    const protocolData = {
      uniswap: {
        tvl: 4200000000, // $4.2B
        apy: 15.5,
        pools: [
          { pair: 'ETH/USDC', apy: 12.3, tvl: 850000000 },
          { pair: 'ETH/USDT', apy: 11.8, tvl: 720000000 },
          { pair: 'WBTC/ETH', apy: 18.2, tvl: 650000000 }
        ]
      },
      aave: {
        tvl: 6800000000, // $6.8B
        supplyApy: 2.5,
        borrowApy: 4.2,
        assets: [
          { symbol: 'ETH', supplyApy: 1.8, borrowApy: 3.5 },
          { symbol: 'USDC', supplyApy: 3.2, borrowApy: 4.8 },
          { symbol: 'USDT', supplyApy: 3.1, borrowApy: 4.7 }
        ]
      },
      compound: {
        tvl: 2100000000, // $2.1B
        supplyApy: 2.1,
        borrowApy: 3.8,
        assets: [
          { symbol: 'ETH', supplyApy: 1.5, borrowApy: 3.2 },
          { symbol: 'USDC', supplyApy: 2.8, borrowApy: 4.1 },
          { symbol: 'DAI', supplyApy: 2.9, borrowApy: 4.3 }
        ]
      }
    };

    return protocolData[protocol.toLowerCase()] || null;
  }
}

export const web3Service = new Web3Service();