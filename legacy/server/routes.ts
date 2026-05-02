// Re-export the new modular route system
export { registerRoutes } from "./routes/index";

// ===========================================
// API Separation Documentation
// ===========================================
/*
The GeFi platform APIs have been separated into distinct modules for better organization:

📁 server/routes/
├── index.ts           - Main route registration and WebSocket setup
├── gefiRoutes.ts      - Core financial platform APIs
├── tokenomicRoutes.ts - Web3, blockchain, and crypto APIs  
├── marketDataRoutes.ts - Market data, trading, and analytics APIs
├── developerRoutes.ts - Developer tools and bounty platform APIs
└── utilityRoutes.ts   - Administrative and utility APIs

🎯 API Categories:

1. GeFi Core APIs (/api/auth, /api/portfolio, /api/risk-assessment)
   - User authentication and profile management
   - Portfolio management and optimization
   - Risk assessment and analytics
   - AI model marketplace integration

2. Tokenomic APIs (/api/web3/*)
   - Wallet connectivity and management
   - DeFi position tracking and operations
   - Smart contract interactions
   - Staking, governance, and cross-chain operations

3. Market Data APIs (/api/market-data/*, /api/trading/*)
   - Live market data feeds
   - Trading operations and order management
   - Sentiment analysis and market insights
   - Trading bot management

4. Developer APIs (/api/bounty-*, /api/ai-model-funding, /api/bot-funding)
   - Bounty creation and funding
   - AI model development funding
   - Trading bot funding and investment
   - Community and collaboration features

5. Utility APIs (/api/debug/*, /api/health, /api/version)
   - System health and monitoring
   - Debug and troubleshooting tools
   - API version and feature information
   - Administrative functions

🚀 Benefits of Separation:
- Improved code organization and maintainability
- Clear separation of concerns between financial and blockchain operations
- Independent scaling and deployment of different API categories
- Better security boundaries and access control
- Easier testing and debugging of specific functionality

🔌 WebSocket Integration:
- Real-time market data streaming
- Portfolio update notifications
- Trading signal broadcasts
- Cross-platform compatibility

This modular structure enables the platform to serve different user types
(investors, developers, data providers, regulators) with optimized APIs
tailored to their specific needs while maintaining system cohesion.
*/

// Legacy compatibility - all functionality moved to modular system
import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerRoutes as registerModularRoutes } from "./routes/index";

// Backwards compatibility wrapper (deprecated)
export async function registerRoutesLegacy(app: Express): Promise<Server> {
  console.warn("⚠️  Using legacy route registration - please update to use the new modular system");
  return registerModularRoutes(app);
}