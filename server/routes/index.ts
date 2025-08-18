import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { setupMultiAuth } from "../multiAuth";

// Import separated route modules
import { registerGeFiRoutes } from "./gefiRoutes";
import { registerTokenomicRoutes } from "./tokenomicRoutes";
import { registerMarketDataRoutes } from "./marketDataRoutes";
import { registerDeveloperRoutes } from "./developerRoutes";
import { registerUtilityRoutes } from "./utilityRoutes";
import { registerChatbotRoutes } from "./chatbotRoutes";
import { registerAdminRoutes } from "./adminRoutes";
import { registerReportRoutes } from "./reportRoutes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware setup
  await setupMultiAuth(app);

  // ===========================================
  // API Route Registration (Modular Structure)
  // ===========================================

  console.log("🚀 Registering GeFi Core APIs...");
  registerGeFiRoutes(app);

  console.log("🌐 Registering Tokenomic & Web3 APIs...");
  registerTokenomicRoutes(app);

  console.log("📈 Registering Market Data & Trading APIs...");
  registerMarketDataRoutes(app);

  console.log("👨‍💻 Registering Developer & Bounty APIs...");
  registerDeveloperRoutes(app);

  console.log("🔧 Registering Utility & Admin APIs...");
  registerUtilityRoutes(app);
  registerAdminRoutes(app);

  console.log("🔍 Registering Search APIs...");
  const searchRouter = (await import("./search")).default;
  app.use("/api/search", searchRouter);

  console.log("🤖 Registering AI Chatbot APIs...");
  registerChatbotRoutes(app);

  // Register auth compatibility routes
  console.log("🔄 Registering Auth Compatibility APIs...");
  const registerAuthCompat = (await import("./authCompat")).default;
  registerAuthCompat(app);

  console.log("📄 Registering Report APIs...");
  const reportsRouter = (await import("./reports")).default;
  app.use("/api/reports", reportsRouter);
  
  console.log("📅 Registering Calendly APIs...");
  const { registerCalendlyRoutes } = await import("./calendlyRoutes");
  registerCalendlyRoutes(app);
  
  console.log("🔬 Registering Backtesting APIs...");
  const { registerBacktestingRoutes } = await import("./backtestingRoutes");
  registerBacktestingRoutes(app);

  // Register profile compatibility routes
  console.log("👤 Registering Profile Compatibility APIs...");
  const registerProfileCompatibilityRoutes = (await import("./profileCompat")).default;
  const { storage } = await import("../storage");
  registerProfileCompatibilityRoutes(app, storage);

  // ===========================================
  // WebSocket Server Setup
  // ===========================================

  const httpServer = createServer(app);
  
  // WebSocket server for real-time features
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws'
  });

  // Store active connections
  const activeConnections = new Map<string, WebSocket>();

  wss.on('connection', (ws: WebSocket, req) => {
    const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    activeConnections.set(connectionId, ws);
    
    console.log(`WebSocket connection established: ${connectionId}`);

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to GeFi real-time services',
      connectionId,
      timestamp: new Date().toISOString()
    }));

    // Handle incoming messages
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log(`WebSocket message received from ${connectionId}:`, message);
        
        // Handle different message types
        switch (message.type) {
          case 'subscribe':
            handleSubscription(ws, message, connectionId);
            break;
          case 'unsubscribe':
            handleUnsubscription(ws, message, connectionId);
            break;
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
            break;
          default:
            ws.send(JSON.stringify({ 
              type: 'error', 
              message: 'Unknown message type',
              timestamp: new Date().toISOString()
            }));
        }
      } catch (error) {
        console.error(`Error processing WebSocket message from ${connectionId}:`, error);
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Invalid message format',
          timestamp: new Date().toISOString()
        }));
      }
    });

    // Handle connection close
    ws.on('close', () => {
      console.log(`WebSocket connection closed: ${connectionId}`);
      activeConnections.delete(connectionId);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error(`WebSocket error for ${connectionId}:`, error);
      activeConnections.delete(connectionId);
    });
  });

  // Subscription management
  function handleSubscription(ws: WebSocket, message: any, connectionId: string) {
    const { channel, symbols } = message;
    
    if (!channel) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Channel is required for subscription',
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // Store subscription info (in production, use Redis or database)
    console.log(`Subscription request: ${connectionId} -> ${channel} with symbols:`, symbols);
    
    ws.send(JSON.stringify({
      type: 'subscribed',
      channel,
      symbols: symbols || [],
      message: `Subscribed to ${channel}`,
      timestamp: new Date().toISOString()
    }));
  }

  function handleUnsubscription(ws: WebSocket, message: any, connectionId: string) {
    const { channel } = message;
    
    console.log(`Unsubscription request: ${connectionId} -> ${channel}`);
    
    ws.send(JSON.stringify({
      type: 'unsubscribed',
      channel,
      message: `Unsubscribed from ${channel}`,
      timestamp: new Date().toISOString()
    }));
  }

  // Broadcast function for real-time updates
  function broadcastToSubscribers(channel: string, data: any) {
    activeConnections.forEach((ws, connectionId) => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify({
            type: 'data',
            channel,
            data,
            timestamp: new Date().toISOString()
          }));
        } catch (error) {
          console.error(`Error broadcasting to ${connectionId}:`, error);
          activeConnections.delete(connectionId);
        }
      } else {
        activeConnections.delete(connectionId);
      }
    });
  }

  // Simulate real-time market data (for demo purposes)
  setInterval(() => {
    const mockMarketData = {
      symbol: 'BTC-USD',
      price: 45000 + (Math.random() - 0.5) * 1000,
      change: (Math.random() - 0.5) * 100,
      volume: Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString()
    };
    
    broadcastToSubscribers('market-data', mockMarketData);
  }, 5000);

  // ===========================================
  // API Documentation & Health Check
  // ===========================================

  // API overview endpoint
  app.get('/api', (req, res) => {
    res.json({
      platform: 'GeFi - AI-Powered Financial Platform',
      version: '2.0.0',
      description: 'Comprehensive financial platform with separated GeFi and Tokenomic APIs',
      apiCategories: {
        gefi: {
          description: 'Core financial platform APIs',
          endpoints: [
            'Authentication & User Management',
            'Portfolio Management',
            'Risk Assessment',
            'AI Model Marketplace'
          ]
        },
        tokenomics: {
          description: 'Web3, blockchain, and cryptocurrency APIs',
          endpoints: [
            'Wallet Management',
            'DeFi Operations',
            'Smart Contracts',
            'Staking & Governance'
          ]
        },
        marketData: {
          description: 'Market data, trading, and analytics APIs',
          endpoints: [
            'Live Market Data',
            'Trading Operations',
            'Sentiment Analysis',
            'Trading Bots'
          ]
        },
        developer: {
          description: 'Developer tools and bounty platform APIs',
          endpoints: [
            'Bounty Management',
            'AI Model Funding',
            'Bot Development',
            'Community Features'
          ]
        },
        utility: {
          description: 'Administrative and utility APIs',
          endpoints: [
            'System Health',
            'Debug Tools',
            'Categories Management',
            'Version Information'
          ]
        }
      },
      features: {
        realTimeData: 'WebSocket support at /ws',
        authentication: 'Multi-provider OAuth (Google, GitHub, LinkedIn)',
        webSocketChannels: ['market-data', 'portfolio-updates', 'trading-signals'],
        rateLimit: 'Applied to all endpoints',
        apiSecurity: 'JWT tokens and session-based authentication'
      },
      documentation: '/api/docs',
      status: 'operational',
      lastUpdated: new Date().toISOString()
    });
  });

  console.log("✅ All API routes registered successfully!");
  console.log("📡 WebSocket server configured on /ws");
  console.log("🔗 API overview available at /api");

  return httpServer;
}

// Export the WebSocket broadcast function for use by other modules
export function createBroadcaster(server: Server) {
  // This would be used by market data services, trading engines, etc.
  // to broadcast real-time updates to connected clients
  return {
    broadcastMarketData: (data: any) => {
      // Implementation would access the WebSocket server instance
      console.log('Broadcasting market data:', data);
    },
    broadcastPortfolioUpdate: (userId: string, data: any) => {
      // Implementation would broadcast to specific user
      console.log(`Broadcasting portfolio update to user ${userId}:`, data);
    },
    broadcastTradingSignal: (data: any) => {
      console.log('Broadcasting trading signal:', data);
    }
  };
}