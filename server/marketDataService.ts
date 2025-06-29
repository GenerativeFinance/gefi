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
  getOrderBook(symbol: string): OrderBook | null {
    return this.orderBooks.get(symbol) || null;
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
    // Simulate market data for common symbols
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX'];
    
    symbols.forEach(symbol => {
      // Initialize with base prices
      const basePrice = this.getBasePriceForSymbol(symbol);
      this.priceCache.set(symbol, {
        symbol,
        price: basePrice,
        volume: Math.floor(Math.random() * 1000000),
        timestamp: Date.now(),
        bid: basePrice * 0.999,
        ask: basePrice * 1.001,
        high24h: basePrice * 1.05,
        low24h: basePrice * 0.95,
        change24h: (Math.random() - 0.5) * 0.1
      });

      // Initialize order book
      this.orderBooks.set(symbol, this.generateOrderBook(symbol, basePrice));
    });

    // Update prices every second
    setInterval(() => {
      this.updateMockPrices();
    }, 1000);

    // Update order books every 500ms
    setInterval(() => {
      this.updateOrderBooks();
    }, 500);
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