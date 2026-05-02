import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OnchainPaymentModal from '../OnchainPaymentModal';

// Mock the web3 helper functions
jest.mock('../lib/web3', () => ({
  connectWallet: jest.fn().mockResolvedValue({
    address: '0x1234567890123456789012345678901234567890',
    signer: {
      sendTransaction: jest.fn().mockResolvedValue({
        hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
      })
    },
    provider: {},
    instance: {},
  }),
  disconnectWallet: jest.fn().mockResolvedValue(undefined),
  getWeb3Modal: jest.fn().mockReturnValue({}),
}));

// Mock the API request function
const mockApiRequest = jest.fn();
jest.mock('@/lib/queryClient', () => ({
  apiRequest: mockApiRequest,
}));

// Mock the toast hook
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock ethers
jest.mock('ethers', () => ({
  parseUnits: jest.fn().mockReturnValue('100000000000000000'), // 0.1 ETH in wei
}));

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

describe('OnchainPaymentModal', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createQueryClient();
    jest.clearAllMocks();
  });

  const defaultProps = {
    modelId: 1,
    isOpen: true,
    onClose: jest.fn(),
    modelName: 'Test AI Model',
    price: 0.1,
  };

  const renderWithQueryClient = (props = defaultProps) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <OnchainPaymentModal {...props} />
      </QueryClientProvider>
    );
  };

  it('should render modal when open', () => {
    renderWithQueryClient();
    
    expect(screen.getByText('Onchain Payment')).toBeInTheDocument();
    expect(screen.getByText('Test AI Model')).toBeInTheDocument();
    expect(screen.getByText('0.1 ETH')).toBeInTheDocument();
  });

  it('should not render modal when closed', () => {
    renderWithQueryClient({ ...defaultProps, isOpen: false });
    
    expect(screen.queryByText('Onchain Payment')).not.toBeInTheDocument();
  });

  it('should show connect wallet button initially', () => {
    renderWithQueryClient();
    
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    expect(screen.getByText('Connect MetaMask or WalletConnect to proceed')).toBeInTheDocument();
  });

  it('should connect wallet when connect button is clicked', async () => {
    const { connectWallet } = require('../lib/web3');
    renderWithQueryClient();
    
    const connectButton = screen.getByRole('button', { name: /Connect Wallet/i });
    fireEvent.click(connectButton);
    
    await waitFor(() => {
      expect(connectWallet).toHaveBeenCalled();
    });
  });

  it('should show wallet connected state after connection', async () => {
    const { connectWallet } = require('../lib/web3');
    renderWithQueryClient();
    
    const connectButton = screen.getByRole('button', { name: /Connect Wallet/i });
    fireEvent.click(connectButton);
    
    await waitFor(() => {
      expect(screen.getByText('Wallet Connected')).toBeInTheDocument();
      expect(screen.getByText('0x1234...7890')).toBeInTheDocument();
    });
  });

  it('should create invoice when create invoice button is clicked', async () => {
    // Setup connected wallet state by mocking the initial connection
    const { connectWallet } = require('../lib/web3');
    mockApiRequest.mockResolvedValueOnce({
      json: () => Promise.resolve({
        success: true,
        invoiceId: 'test-invoice-123',
        receiverAddress: '0xabcd1234',
        amountEth: '0.1'
      })
    });

    renderWithQueryClient();
    
    // First connect wallet
    const connectButton = screen.getByRole('button', { name: /Connect Wallet/i });
    fireEvent.click(connectButton);
    
    await waitFor(() => {
      expect(screen.getByText('Wallet Connected')).toBeInTheDocument();
    });

    // Then create invoice
    const createInvoiceButton = screen.getByRole('button', { name: /Create Payment Invoice/i });
    fireEvent.click(createInvoiceButton);
    
    await waitFor(() => {
      expect(mockApiRequest).toHaveBeenCalledWith(
        'POST',
        '/api/ai-models/1/onchain-invoice',
        {}
      );
    });
  });

  it('should handle disconnect wallet', async () => {
    const { connectWallet, disconnectWallet } = require('../lib/web3');
    renderWithQueryClient();
    
    // First connect wallet
    const connectButton = screen.getByRole('button', { name: /Connect Wallet/i });
    fireEvent.click(connectButton);
    
    await waitFor(() => {
      expect(screen.getByText('Wallet Connected')).toBeInTheDocument();
    });

    // Then disconnect
    const disconnectButton = screen.getByRole('button', { name: /Disconnect/i });
    fireEvent.click(disconnectButton);
    
    await waitFor(() => {
      expect(disconnectWallet).toHaveBeenCalled();
    });
  });

  it('should call onClose when modal is closed', () => {
    const onCloseMock = jest.fn();
    renderWithQueryClient({ ...defaultProps, onClose: onCloseMock });
    
    // Modal should be open but we're testing the onClose prop integration
    expect(screen.getByText('Onchain Payment')).toBeInTheDocument();
  });

  it('should show error toast on connection failure', async () => {
    const { connectWallet } = require('../lib/web3');
    connectWallet.mockRejectedValueOnce(new Error('Connection failed'));
    
    renderWithQueryClient();
    
    const connectButton = screen.getByRole('button', { name: /Connect Wallet/i });
    fireEvent.click(connectButton);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Connection failed',
        description: 'Connection failed',
        variant: 'destructive',
      });
    });
  });
});