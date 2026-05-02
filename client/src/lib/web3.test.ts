import { getWeb3Modal, connectWallet, disconnectWallet } from './web3';

// Mock Web3Modal and dependencies
jest.mock('web3modal', () => {
  return jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue({
      request: jest.fn(),
      on: jest.fn(),
      removeListener: jest.fn(),
    }),
    clearCachedProvider: jest.fn().mockResolvedValue(undefined),
  }));
});

jest.mock('@walletconnect/web3-provider');

jest.mock('ethers', () => ({
  BrowserProvider: jest.fn().mockImplementation(() => ({
    getSigner: jest.fn().mockResolvedValue({
      getAddress: jest.fn().mockResolvedValue('0x1234567890123456789012345678901234567890'),
      sendTransaction: jest.fn().mockResolvedValue({ 
        hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' 
      }),
    }),
  })),
  parseUnits: jest.fn().mockReturnValue('100000000000000000'), // 0.1 ETH in wei
}));

describe('Web3 Helper Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables
    delete process.env.NEXT_PUBLIC_ONCHAIN_RPC_URL;
    delete process.env.NEXT_PUBLIC_INFURA_ID;
  });

  describe('getWeb3Modal', () => {
    it('should create and return a Web3Modal instance', () => {
      const modal = getWeb3Modal();
      expect(modal).toBeDefined();
    });

    it('should return the same instance on subsequent calls', () => {
      const modal1 = getWeb3Modal();
      const modal2 = getWeb3Modal();
      expect(modal1).toBe(modal2);
    });
  });

  describe('connectWallet', () => {
    it('should connect wallet and return provider, signer, instance, and address', async () => {
      const result = await connectWallet();
      
      expect(result).toHaveProperty('provider');
      expect(result).toHaveProperty('signer');
      expect(result).toHaveProperty('instance');
      expect(result).toHaveProperty('address');
      expect(result.address).toBe('0x1234567890123456789012345678901234567890');
    });
  });

  describe('disconnectWallet', () => {
    it('should disconnect wallet without throwing errors', async () => {
      await expect(disconnectWallet()).resolves.not.toThrow();
    });
  });

  describe('Environment variable handling', () => {
    it('should handle RPC_URL environment variable', () => {
      process.env.NEXT_PUBLIC_ONCHAIN_RPC_URL = 'https://mainnet.infura.io/v3/test';
      const modal = getWeb3Modal();
      expect(modal).toBeDefined();
    });

    it('should handle INFURA_ID environment variable', () => {
      process.env.NEXT_PUBLIC_INFURA_ID = 'test-infura-id';
      const modal = getWeb3Modal();
      expect(modal).toBeDefined();
    });
  });
});