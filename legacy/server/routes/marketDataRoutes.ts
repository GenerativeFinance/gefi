import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../multiAuth";
import { marketDataService } from "../marketDataService";
import { tradingService } from "../tradingService";

export function registerMarketDataRoutes(app: Express) {
  // ===========================================
  // Market Data & Trading APIs
  // ===========================================

  // Market data endpoints
  app.get('/api/market-data/live', async (req, res) => {
    try {
      const { symbols, category } = req.query;
      const symbolList = symbols ? (symbols as string).split(',') : ['BTC-USD', 'ETH-USD', 'AAPL', 'TSLA'];
      
      const marketData = await marketDataService.getLiveData(symbolList, category as string);
      res.json(marketData);
    } catch (error) {
      console.error("Error fetching live market data:", error);
      res.status(500).json({ message: "Failed to fetch live market data" });
    }
  });

  app.get('/api/market-data/historical', async (req, res) => {
    try {
      const { symbol, timeframe, start, end } = req.query;
      
      if (!symbol) {
        return res.status(400).json({ message: "Symbol parameter is required" });
      }

      const historicalData = await marketDataService.getHistoricalData(
        symbol as string,
        timeframe as string,
        start as string,
        end as string
      );
      
      res.json(historicalData);
    } catch (error) {
      console.error("Error fetching historical data:", error);
      res.status(500).json({ message: "Failed to fetch historical data" });
    }
  });

  app.get('/api/market-data/orderbook', async (req, res) => {
    try {
      const { symbol, depth = '20' } = req.query;
      
      if (!symbol) {
        return res.status(400).json({ message: "Symbol parameter is required" });
      }

      const orderbook = await marketDataService.getOrderBook(symbol as string, parseInt(depth as string));
      res.json(orderbook);
    } catch (error) {
      console.error("Error fetching orderbook:", error);
      res.status(500).json({ message: "Failed to fetch orderbook" });
    }
  });

  app.get('/api/market-data/trades', async (req, res) => {
    try {
      const { symbol, limit = '50' } = req.query;
      
      if (!symbol) {
        return res.status(400).json({ message: "Symbol parameter is required" });
      }

      const trades = await marketDataService.getRecentTrades(symbol as string, parseInt(limit as string));
      res.json(trades);
    } catch (error) {
      console.error("Error fetching recent trades:", error);
      res.status(500).json({ message: "Failed to fetch recent trades" });
    }
  });

  // Sentiment Analysis
  app.get('/api/market-data/sentiment', async (req, res) => {
    try {
      const { symbols, category } = req.query;
      const symbolList = symbols ? (symbols as string).split(',') : ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'BTC', 'ETH'];
      const sentimentData = await marketDataService.getSentimentData(symbolList);
      res.json(sentimentData);
    } catch (error) {
      console.error("Error fetching sentiment data:", error);
      res.status(500).json({ message: "Failed to fetch sentiment data" });
    }
  });

  // Trading endpoints
  app.post('/api/trading/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { symbol, type, side, quantity, price, stopPrice } = req.body;
      
      if (!symbol || !type || !side || !quantity) {
        return res.status(400).json({ message: "Missing required order parameters" });
      }

      const order = await tradingService.placeOrder(userId, {
        symbol,
        type,
        side,
        quantity: parseFloat(quantity),
        price: price ? parseFloat(price) : undefined,
        stopPrice: stopPrice ? parseFloat(stopPrice) : undefined
      });
      
      res.status(201).json(order);
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ message: "Failed to place order" });
    }
  });

  app.get('/api/trading/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { status, symbol, limit = '50' } = req.query;
      
      const orders = await tradingService.getUserOrders(userId, {
        status: status as string,
        symbol: symbol as string,
        limit: parseInt(limit as string)
      });
      
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.delete('/api/trading/orders/:orderId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { orderId } = req.params;
      
      await tradingService.cancelOrder(userId, orderId);
      res.json({ message: "Order cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling order:", error);
      res.status(500).json({ message: "Failed to cancel order" });
    }
  });

  app.get('/api/trading/positions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const positions = await tradingService.getUserPositions(userId);
      res.json(positions);
    } catch (error) {
      console.error("Error fetching positions:", error);
      res.status(500).json({ message: "Failed to fetch positions" });
    }
  });

  app.get('/api/trading/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { symbol, startDate, endDate, limit = '100' } = req.query;
      
      const history = await tradingService.getTradingHistory(userId, {
        symbol: symbol as string,
        startDate: startDate as string,
        endDate: endDate as string,
        limit: parseInt(limit as string)
      });
      
      res.json(history);
    } catch (error) {
      console.error("Error fetching trading history:", error);
      res.status(500).json({ message: "Failed to fetch trading history" });
    }
  });

  // Trading Bots
  app.get('/api/trading/bots', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const bots = await storage.getUserTradingBots(userId);
      res.json(bots);
    } catch (error) {
      console.error("Error fetching trading bots:", error);
      res.status(500).json({ message: "Failed to fetch trading bots" });
    }
  });

  app.post('/api/trading/bots', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const botData = { ...req.body, userId };
      
      const bot = await storage.createTradingBot(botData);
      res.status(201).json(bot);
    } catch (error) {
      console.error("Error creating trading bot:", error);
      res.status(500).json({ message: "Failed to create trading bot" });
    }
  });

  app.put('/api/trading/bots/:botId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { botId } = req.params;
      
      // Verify bot ownership
      const bot = await storage.getTradingBot(botId);
      if (!bot || bot.userId !== userId) {
        return res.status(404).json({ message: "Trading bot not found" });
      }

      const updatedBot = await storage.updateTradingBot(botId, req.body);
      res.json(updatedBot);
    } catch (error) {
      console.error("Error updating trading bot:", error);
      res.status(500).json({ message: "Failed to update trading bot" });
    }
  });

  app.delete('/api/trading/bots/:botId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { botId } = req.params;
      
      // Verify bot ownership
      const bot = await storage.getTradingBot(botId);
      if (!bot || bot.userId !== userId) {
        return res.status(404).json({ message: "Trading bot not found" });
      }

      await storage.deleteTradingBot(botId);
      res.json({ message: "Trading bot deleted successfully" });
    } catch (error) {
      console.error("Error deleting trading bot:", error);
      res.status(500).json({ message: "Failed to delete trading bot" });
    }
  });

  app.post('/api/trading/bots/:botId/start', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { botId } = req.params;
      
      // Verify bot ownership
      const bot = await storage.getTradingBot(botId);
      if (!bot || bot.userId !== userId) {
        return res.status(404).json({ message: "Trading bot not found" });
      }

      await tradingService.startTradingBot(botId);
      res.json({ message: "Trading bot started successfully" });
    } catch (error) {
      console.error("Error starting trading bot:", error);
      res.status(500).json({ message: "Failed to start trading bot" });
    }
  });

  app.post('/api/trading/bots/:botId/stop', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { botId } = req.params;
      
      // Verify bot ownership
      const bot = await storage.getTradingBot(botId);
      if (!bot || bot.userId !== userId) {
        return res.status(404).json({ message: "Trading bot not found" });
      }

      await tradingService.stopTradingBot(botId);
      res.json({ message: "Trading bot stopped successfully" });
    } catch (error) {
      console.error("Error stopping trading bot:", error);
      res.status(500).json({ message: "Failed to stop trading bot" });
    }
  });

}