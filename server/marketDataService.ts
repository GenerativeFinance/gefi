import { WebSocket } from 'ws';
import { EventEmitter } from 'events';

export interface MarketDataPoint {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
  bid?: number;
  ask?: number;
  high24h?: number;
  low24h?: number;
  change24h?: number;
  assetType: 'stock' | 'crypto' | 'forex' | 'commodity' | 'index';
  marketCap?: number;
  sentiment?: SentimentData;
}

export interface SentimentData {
  score: number; // -1 to 1 scale
  confidence: number; // 0 to 1 scale
  sources: string[];
  keywords: string[];
  news_sentiment: number;
  social_sentiment: number;
  technical_sentiment: number;
}

export interface OrderBookLevel {
  price: number;
  size: number;
}

export interface OrderBook {
  symbol: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  timestamp: number;
}

export interface Trade {
  symbol: string;
  price: number;
  quantity: number;
  side: 'buy' | 'sell';
  timestamp: number;
  tradeId: string;
}

class MarketDataService extends EventEmitter {
  private connections: Map<string, WebSocket> = new Map();
  private subscriptions: Map<string, Set<string>> = new Map();
  private priceCache: Map<string, MarketDataPoint> = new Map();
  private orderBooks: Map<string, OrderBook> = new Map();
  
  constructor() {
    super();
    this.setupMockDataFeed(); // For development - replace with real APIs
  }

  // Subscribe to real-time price updates for symbols
  subscribe(symbols: string[]): void {
    symbols.forEach(symbol => {
      if (!this.subscriptions.has(symbol)) {
        this.subscriptions.set(symbol, new Set());
        this.connectToFeed(symbol);
      }
    });
  }

  // Unsubscribe from price updates
  unsubscribe(symbols: string[]): void {
    symbols.forEach(symbol => {
      const connection = this.connections.get(symbol);
      if (connection) {
        connection.close();
        this.connections.delete(symbol);
        this.subscriptions.delete(symbol);
      }
    });
  }

  // Get current price for a symbol
  getCurrentPrice(symbol: string): MarketDataPoint | null {
    return this.priceCache.get(symbol) || null;
  }

  // Get order book for a symbol
  getOrderBook(symbol: string, depth: number = 20): OrderBook | null {
    let orderBook = this.orderBooks.get(symbol);
    
    if (!orderBook) {
      // Generate order book if it doesn't exist
      const currentPrice = this.getCurrentPrice(symbol)?.price || this.getBasePriceForSymbol(symbol);
      orderBook = this.generateOrderBook(symbol, currentPrice);
      this.orderBooks.set(symbol, orderBook);
    }
    
    // Limit to requested depth
    return {
      ...orderBook,
      bids: orderBook.bids.slice(0, depth),
      asks: orderBook.asks.slice(0, depth)
    };
  }

  // Get all current prices
  getAllPrices(): Map<string, MarketDataPoint> {
    return new Map(this.priceCache);
  }

  private connectToFeed(symbol: string): void {
    // In production, this would connect to real market data providers
    // For now, we'll use the mock data setup in constructor
    console.log(`Connected to feed for ${symbol}`);
  }

  private setupMockDataFeed(): void {
    // Comprehensive multi-asset market data simulation
    const assetData = [
      // Stocks
      { symbol: 'AAPL', type: 'stock', basePrice: 185.00, volume: 50000000 },
      { symbol: 'GOOGL', type: 'stock', basePrice: 2617.61, volume: 1200000 },
      { symbol: 'MSFT', type: 'stock', basePrice: 391.22, volume: 25000000 },
      { symbol: 'TSLA', type: 'stock', basePrice: 240.56, volume: 80000000 },
      { symbol: 'AMZN', type: 'stock', basePrice: 3072.76, volume: 35000000 },
      { symbol: 'NVDA', type: 'stock', basePrice: 440.61, volume: 45000000 },
      { symbol: 'META', type: 'stock', basePrice: 337.19, volume: 20000000 },
      { symbol: 'NFLX', type: 'stock', basePrice: 456.15, volume: 8000000 },
      
      // Cryptocurrencies
      { symbol: 'BTC', type: 'crypto', basePrice: 65000, volume: 25000, marketCap: 1200000000000 },
      { symbol: 'ETH', type: 'crypto', basePrice: 3200, volume: 120000, marketCap: 380000000000 },
      { symbol: 'XRP', type: 'crypto', basePrice: 0.60, volume: 1500000000, marketCap: 28000000000 },
      { symbol: 'LTC', type: 'crypto', basePrice: 150, volume: 300000, marketCap: 10000000000 },
      
      // Forex
      { symbol: 'EURUSD', type: 'forex', basePrice: 1.0850, volume: 2500000000 },
      { symbol: 'GBPUSD', type: 'forex', basePrice: 1.2650, volume: 1800000000 },
      { symbol: 'USDJPY', type: 'forex', basePrice: 149.50, volume: 2200000000 },
      
      // Commodities
      { symbol: 'GOLD', type: 'commodity', basePrice: 2300, volume: 850000 },
      { symbol: 'SILVER', type: 'commodity', basePrice: 28, volume: 12000000 },
      { symbol: 'OIL', type: 'commodity', basePrice: 75, volume: 350000000 },
      
      // Indices
      { symbol: 'SPX', type: 'index', basePrice: 5200, volume: 0 },
      { symbol: 'NDX', type: 'index', basePrice: 18000, volume: 0 },
      { symbol: 'DJI', type: 'index', basePrice: 42000, volume: 0 }
    ];
    
    assetData.forEach(asset => {
      const sentiment = this.generateSentimentData(asset.symbol);
      const change24h = (Math.random() - 0.5) * 0.1;
      
      this.priceCache.set(asset.symbol, {
        symbol: asset.symbol,
        price: asset.basePrice,
        volume: asset.volume + Math.floor(Math.random() * asset.volume * 0.2),
        timestamp: Date.now(),
        assetType: asset.type as any,
        bid: asset.basePrice * 0.999,
        ask: asset.basePrice * 1.001,
        high24h: asset.basePrice * (1 + Math.abs(change24h) + 0.02),
        low24h: asset.basePrice * (1 - Math.abs(change24h) - 0.02),
        change24h,
        marketCap: asset.marketCap,
        sentiment
      });

      // Initialize order book for tradeable assets
      if (asset.type !== 'index') {
        this.orderBooks.set(asset.symbol, this.generateOrderBook(asset.symbol, asset.basePrice));
      }
    });

    // Update prices and sentiment every second
    setInterval(() => {
      this.updateMockPricesWithSentiment();
    }, 1000);

    // Update order books every 500ms
    setInterval(() => {
      this.updateOrderBooks();
    }, 500);

    // Update sentiment data every 30 seconds
    setInterval(() => {
      this.updateSentimentData();
    }, 30000);
  }

  private generateSentimentData(symbol: string): SentimentData {
    const baseScore = (Math.random() - 0.5) * 2; // -1 to 1
    const confidence = 0.6 + Math.random() * 0.4; // 0.6 to 1.0
    
    const newsScore = baseScore + (Math.random() - 0.5) * 0.3;
    const socialScore = baseScore + (Math.random() - 0.5) * 0.4;
    const technicalScore = baseScore + (Math.random() - 0.5) * 0.2;
    
    return {
      score: Math.max(-1, Math.min(1, baseScore)),
      confidence,
      sources: ['news', 'social', 'technical'],
      keywords: this.generateSentimentKeywords(symbol, baseScore),
      news_sentiment: Math.max(-1, Math.min(1, newsScore)),
      social_sentiment: Math.max(-1, Math.min(1, socialScore)),
      technical_sentiment: Math.max(-1, Math.min(1, technicalScore))
    };
  }

  private generateSentimentKeywords(symbol: string, score: number): string[] {
    const positiveKeywords = ['bullish', 'growth', 'strong', 'momentum', 'rally', 'breakout'];
    const negativeKeywords = ['bearish', 'decline', 'weak', 'sell-off', 'correction', 'volatility'];
    const neutralKeywords = ['sideways', 'consolidation', 'mixed', 'uncertain', 'ranging'];
    
    if (score > 0.3) {
      return positiveKeywords.slice(0, 2 + Math.floor(Math.random() * 2));
    } else if (score < -0.3) {
      return negativeKeywords.slice(0, 2 + Math.floor(Math.random() * 2));
    } else {
      return neutralKeywords.slice(0, 1 + Math.floor(Math.random() * 2));
    }
  }

  private getBasePriceForSymbol(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'AAPL': 185.00,
      'GOOGL': 2750.00,
      'MSFT': 378.00,
      'TSLA': 245.00,
      'AMZN': 3100.00,
      'NVDA': 450.00,
      'META': 320.00,
      'NFLX': 450.00
    };
    return basePrices[symbol] || 100.00;
  }

  private updateMockPrices(): void {
    this.priceCache.forEach((data, symbol) => {
      // Simulate price movement (± 0.5%)
      const change = (Math.random() - 0.5) * 0.01;
      const newPrice = data.price * (1 + change);
      
      const updatedData: MarketDataPoint = {
        ...data,
        price: newPrice,
        volume: data.volume + Math.floor(Math.random() * 10000),
        timestamp: Date.now(),
        bid: newPrice * 0.999,
        ask: newPrice * 1.001,
        change24h: (data.change24h || 0) + change
      };

      this.priceCache.set(symbol, updatedData);
      
      // Emit price update event
      this.emit('priceUpdate', updatedData);
    });
  }

  private updateMockPricesWithSentiment(): void {
    this.priceCache.forEach((data, symbol) => {
      // Simulate price movement influenced by sentiment
      const sentimentInfluence = data.sentiment ? data.sentiment.score * 0.002 : 0;
      const randomChange = (Math.random() - 0.5) * 0.01;
      const change = randomChange + sentimentInfluence;
      
      const newPrice = data.price * (1 + change);
      
      const updatedData: MarketDataPoint = {
        ...data,
        price: newPrice,
        volume: data.volume + Math.floor(Math.random() * (data.volume * 0.05)),
        timestamp: Date.now(),
        bid: newPrice * 0.999,
        ask: newPrice * 1.001,
        change24h: (data.change24h || 0) + change,
        high24h: Math.max(data.high24h || newPrice, newPrice),
        low24h: Math.min(data.low24h || newPrice, newPrice)
      };

      this.priceCache.set(symbol, updatedData);
      
      // Emit price update event
      this.emit('priceUpdate', updatedData);
    });
  }

  private updateSentimentData(): void {
    this.priceCache.forEach((data, symbol) => {
      if (data.sentiment) {
        // Update sentiment with some evolution
        const newSentiment = this.generateSentimentData(symbol);
        const blendedSentiment: SentimentData = {
          ...newSentiment,
          score: (data.sentiment.score * 0.7) + (newSentiment.score * 0.3),
          confidence: (data.sentiment.confidence * 0.8) + (newSentiment.confidence * 0.2)
        };

        const updatedData: MarketDataPoint = {
          ...data,
          sentiment: blendedSentiment,
          timestamp: Date.now()
        };

        this.priceCache.set(symbol, updatedData);
        
        // Emit sentiment update event
        this.emit('sentimentUpdate', { symbol, sentiment: blendedSentiment });
      }
    });
  }

  private generateOrderBook(symbol: string, basePrice: number): OrderBook {
    const bids: OrderBookLevel[] = [];
    const asks: OrderBookLevel[] = [];

    // Generate 10 bid and ask levels
    for (let i = 0; i < 10; i++) {
      bids.push({
        price: basePrice * (1 - (i + 1) * 0.001),
        size: Math.floor(Math.random() * 1000) + 100
      });

      asks.push({
        price: basePrice * (1 + (i + 1) * 0.001),
        size: Math.floor(Math.random() * 1000) + 100
      });
    }

    return {
      symbol,
      bids: bids.sort((a, b) => b.price - a.price), // Highest bid first
      asks: asks.sort((a, b) => a.price - b.price), // Lowest ask first
      timestamp: Date.now()
    };
  }

  private updateOrderBooks(): void {
    this.orderBooks.forEach((orderBook, symbol) => {
      const currentPrice = this.priceCache.get(symbol)?.price || 100;
      const updatedOrderBook = this.generateOrderBook(symbol, currentPrice);
      this.orderBooks.set(symbol, updatedOrderBook);
      
      // Emit order book update
      this.emit('orderBookUpdate', updatedOrderBook);
    });
  }

  // Simulate trade execution
  generateTrade(symbol: string): Trade {
    const currentPrice = this.getCurrentPrice(symbol);
    if (!currentPrice) {
      throw new Error(`No price data for symbol: ${symbol}`);
    }

    const trade: Trade = {
      symbol,
      price: currentPrice.price * (1 + (Math.random() - 0.5) * 0.002), // ±0.2% variation
      quantity: Math.floor(Math.random() * 1000) + 10,
      side: Math.random() > 0.5 ? 'buy' : 'sell',
      timestamp: Date.now(),
      tradeId: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    this.emit('trade', trade);
    return trade;
  }

  // Get historical data for backtesting
  async getHistoricalData(symbol: string, startDate: string, endDate: string, interval: string = '1d'): Promise<MarketDataPoint[]> {
    // In production, this would fetch from real data providers
    // For now, generate mock historical data
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const intervalMs = this.getIntervalMs(interval);
    const points: MarketDataPoint[] = [];
    
    const basePrice = this.getBasePriceForSymbol(symbol);
    let currentPrice = basePrice;
    
    for (let timestamp = start; timestamp <= end; timestamp += intervalMs) {
      // Simulate price movement
      const change = (Math.random() - 0.5) * 0.05; // ±2.5% daily change
      currentPrice = currentPrice * (1 + change);
      
      points.push({
        symbol,
        price: currentPrice,
        volume: Math.floor(Math.random() * 1000000) + 100000,
        timestamp,
        high24h: currentPrice * (1 + Math.random() * 0.03),
        low24h: currentPrice * (1 - Math.random() * 0.03),
        change24h: change
      });
    }
    
    return points;
  }

  private getIntervalMs(interval: string): number {
    const intervals: { [key: string]: number } = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
      '1w': 7 * 24 * 60 * 60 * 1000
    };
    return intervals[interval] || intervals['1d'];
  }

  // Get live market data with sentiment analysis
  async getLiveData(symbols: string[], category?: string): Promise<MarketDataPoint[]> {
    const filteredSymbols = symbols.filter(symbol => {
      if (!category || category === 'all') return true;
      
      const data = this.priceCache.get(symbol);
      if (!data) return false;
      
      return data.assetType === category;
    });

    const results: MarketDataPoint[] = [];
    
    for (const symbol of filteredSymbols) {
      let data = this.priceCache.get(symbol);
      
      // If data doesn't exist, generate it
      if (!data) {
        const assetType = this.getAssetType(symbol);
        const basePrice = this.getBasePriceForSymbol(symbol);
        
        data = {
          symbol,
          price: basePrice,
          volume: Math.floor(Math.random() * 10000000) + 1000000,
          timestamp: Date.now(),
          bid: basePrice * 0.999,
          ask: basePrice * 1.001,
          high24h: basePrice * 1.05,
          low24h: basePrice * 0.95,
          change24h: (Math.random() - 0.5) * 0.1,
          assetType,
          sentiment: this.generateSentimentData(symbol)
        };
        
        if (assetType === 'crypto') {
          data.marketCap = basePrice * Math.floor(Math.random() * 100000000) + 1000000000;
        }
        
        this.priceCache.set(symbol, data);
      }
      
      results.push(data);
    }
    
    return results;
  }

  // Get sentiment data for specific symbols
  async getSentimentData(symbols: string[]): Promise<{ symbol: string; sentiment: SentimentData }[]> {
    const results: { symbol: string; sentiment: SentimentData }[] = [];
    
    for (const symbol of symbols) {
      let data = this.priceCache.get(symbol);
      
      if (!data || !data.sentiment) {
        const sentiment = this.generateSentimentData(symbol);
        results.push({ symbol, sentiment });
        
        // Update cache if data exists
        if (data) {
          data.sentiment = sentiment;
          this.priceCache.set(symbol, data);
        }
      } else {
        results.push({ symbol, sentiment: data.sentiment });
      }
    }
    
    return results;
  }

  // Get recent trades for a symbol
  async getRecentTrades(symbol: string, limit: number = 50): Promise<Trade[]> {
    const trades: Trade[] = [];
    const currentPrice = this.getCurrentPrice(symbol)?.price || this.getBasePriceForSymbol(symbol);
    
    for (let i = 0; i < limit; i++) {
      trades.push({
        symbol,
        price: currentPrice * (1 + (Math.random() - 0.5) * 0.01),
        quantity: Math.floor(Math.random() * 1000) + 10,
        side: Math.random() > 0.5 ? 'buy' : 'sell',
        timestamp: Date.now() - (i * 1000 * Math.random() * 60),
        tradeId: `trade_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`
      });
    }
    
    return trades.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get asset type from symbol
  private getAssetType(symbol: string): 'stock' | 'crypto' | 'forex' | 'commodity' | 'index' {
    if (['BTC', 'ETH', 'XRP', 'LTC', 'ADA', 'DOT', 'LINK', 'UNI'].includes(symbol)) {
      return 'crypto';
    }
    if (['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD'].includes(symbol)) {
      return 'forex';
    }
    if (['GOLD', 'SILVER', 'OIL', 'NATURAL_GAS'].includes(symbol)) {
      return 'commodity';
    }
    if (['SPY', 'QQQ', 'DIA', 'IWM'].includes(symbol)) {
      return 'index';
    }
    return 'stock';
  }

  // Clean up connections
  destroy(): void {
    this.connections.forEach((ws) => {
      ws.close();
    });
    this.connections.clear();
    this.subscriptions.clear();
    this.removeAllListeners();
  }
}

export const marketDataService = new MarketDataService();