# GeFi - AI Financial Platform

## Overview
GeFi is a comprehensive AI-powered financial platform designed for developers to create and monetize AI financial models, and for investors to access advanced financial analytics and risk management tools. It integrates modern web technologies with machine learning to offer real-time portfolio management, risk assessment, and market insights.

## Features
- **AI Model Marketplace**: Discover, subscribe, and manage AI financial models
- **Portfolio Management**: Real-time analytics and optimization
- **Risk Management**: Monitoring, stress testing, and VaR calculation  
- **Web3 & DeFi Integration**: Multi-wallet support for onchain payments
- **Smart Contracts**: Transparent revenue sharing
- **Advanced Analytics**: AI-generated market insights and reporting

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui
- **Routing**: Wouter
- **State Management**: TanStack Query
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **API Design**: RESTful endpoints

### Web3 Integration
- **Web3 Modal**: Unified wallet connection interface
- **WalletConnect**: Mobile wallet support
- **MetaMask**: Browser extension support
- **Ethers.js**: Ethereum interaction library

## Environment Variables

### Required
```bash
DATABASE_URL=postgresql://...  # PostgreSQL connection string
```

### Optional - Web3 Configuration
```bash
# RPC endpoint for blockchain interactions (recommended)
NEXT_PUBLIC_ONCHAIN_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID

# Alternative: Infura project ID for WalletConnect
NEXT_PUBLIC_INFURA_ID=your_infura_project_id

# Receiver address for onchain payments (server-side)
ONCHAIN_RECEIVER_ADDRESS=0x742d35Cc6634C0532925a3b8D24b693d54b32625
```

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create `.env.local` with your database URL and optional Web3 configuration.

3. **Database Setup**
   ```bash
   npm run db:push
   ```

4. **Build & Start**
   ```bash
   npm run build
   npm start
   ```

   Or for development:
   ```bash
   npm run dev
   ```

## Web3 Payments

The platform supports onchain AI model subscriptions via Web3Modal integration:

### Supported Wallets
- **MetaMask**: Browser extension
- **WalletConnect**: Mobile wallets (Trust Wallet, Rainbow, etc.)

### Testing Onchain Payments

1. **Setup Test Environment**
   ```bash
   # Use Sepolia testnet endpoint
   NEXT_PUBLIC_ONCHAIN_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   
   # Or Goerli testnet
   NEXT_PUBLIC_ONCHAIN_RPC_URL=https://goerli.infura.io/v3/YOUR_PROJECT_ID
   ```

2. **Test Wallets**
   - Ensure MetaMask is connected to the same testnet
   - Get test ETH from faucets:
     - [Sepolia Faucet](https://sepoliafaucet.com/)
     - [Goerli Faucet](https://goerlifaucet.com/)

3. **Test Flow**
   - Navigate to AI Models page (`/ai-models`)
   - Click the wallet icon (💳) next to any Subscribe button
   - Connect your wallet via Web3Modal
   - Create invoice and complete payment
   - Verify transaction on testnet explorer

### WalletConnect Testing
- Open Web3Modal and select WalletConnect
- Scan QR code with mobile wallet app
- Complete payment on mobile device
- Verify connection and transaction

### Payment Flow
1. **Connect Wallet**: Web3Modal supports MetaMask + WalletConnect
2. **Create Invoice**: Server generates payment details
3. **Send Transaction**: User approves and sends ETH
4. **Verify Payment**: Server validates blockchain transaction
5. **Activate Subscription**: AI model access granted

## API Endpoints

### Onchain Payment Routes
- `POST /api/ai-models/:id/onchain-invoice` - Create payment invoice
- `POST /api/ai-models/:id/verify-onchain` - Verify blockchain transaction

### AI Models
- `GET /api/ai-models` - List available models
- `GET /api/ai-models/:id` - Get model details
- `POST /api/ai-models/:id/subscribe` - Traditional subscription

## Troubleshooting

### Web3 Issues
- **Connection Failed**: Ensure wallet is installed and unlocked
- **Wrong Network**: Switch wallet to correct network (mainnet/testnet)
- **Transaction Failed**: Check gas fees and wallet balance
- **WalletConnect Issues**: Try refreshing the QR code

### Build Issues
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (requires Node 16+)
- Clear `node_modules` and reinstall if needed

## Development

### Adding New Payment Methods
The Web3 integration is modular and can be extended:

1. **Update `client/src/lib/web3.ts`** - Add new provider options
2. **Modify `OnchainPaymentModal.tsx`** - Add UI for new wallet types
3. **Extend server validation** - Support new blockchain networks

### Testing Locally
```bash
# Install dependencies (skip puppeteer for faster installs)
PUPPETEER_SKIP_DOWNLOAD=true npm install

# Start development server
npm run dev
```

## Contributing
1. Fork the repository
2. Create feature branch
3. Test changes locally
4. Submit pull request with detailed description

## Support
For issues with Web3 integration or onchain payments, please check:
- Wallet connection status
- Network configuration
- Transaction logs in browser console
- Server logs for payment verification