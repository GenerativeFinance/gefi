import { EventEmitter } from 'events';
import { marketDataService } from './marketDataService';

export interface Order {
  id: string;
  userId: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: 'pending' | 'partially_filled' | 'filled' | 'cancelled' | 'rejected';
  filledQuantity: number;
  averagePrice: number;
  timestamp: number;
  updatedAt: number;
  timeInForce?: 'GTC' | 'IOC' | 'FOK' | 'DAY';
  clientOrderId?: string;
}

export interface Position {
  userId: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  marketValue: number;
  unrealizedPnL: number;
  realizedPnL: number;
  lastUpdated: number;
}

export interface Portfolio {
  userId: string;
  totalValue: number;
  cashBalance: number;
  positions: Position[];
  dayPnL: number;
  totalPnL: number;
  buyingPower: number;
  marginUsed: number;
  lastUpdated: number;
}

export interface ExecutionReport {
  orderId: string;
  executionId: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: number;
  commission: number;
  fees: number;
}

class TradingService extends EventEmitter {
  private orders: Map<string, Order> = new Map();
  private positions: Map<string, Position[]> = new Map();
  private portfolios: Map<string, Portfolio> = new Map();
  private nextOrderId: number = 1;
  private nextExecutionId: number = 1;

  constructor() {
    super();
    this.setupOrderMatching();
  }

  // Submit a new order
  async submitOrder(userId: string, orderRequest: {
    symbol: string;
    side: 'buy' | 'sell';
    type: 'market' | 'limit' | 'stop' | 'stop_limit';
    quantity: number;
    price?: number;
    stopPrice?: number;
    timeInForce?: 'GTC' | 'IOC' | 'FOK' | 'DAY';
    clientOrderId?: string;
  }): Promise<Order> {
    
    // Validate order
    const validation = this.validateOrder(userId, orderRequest);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const order: Order = {
      id: `order_${this.nextOrderId++}`,
      userId,
      symbol: orderRequest.symbol,
      side: orderRequest.side,
      type: orderRequest.type,
      quantity: orderRequest.quantity,
      price: orderRequest.price,
      stopPrice: orderRequest.stopPrice,
      status: 'pending',
      filledQuantity: 0,
      averagePrice: 0,
      timestamp: Date.now(),
      updatedAt: Date.now(),
      timeInForce: orderRequest.timeInForce || 'GTC',
      clientOrderId: orderRequest.clientOrderId
    };

    this.orders.set(order.id, order);
    
    // Emit order status
    this.emit('orderStatus', order);
    
    // Process market orders immediately
    if (order.type === 'market') {
      await this.executeMarketOrder(order);
    }

    return order;
  }

  // Cancel an order
  async cancelOrder(userId: string, orderId: string): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    if (order.userId !== userId) {
      throw new Error('Unauthorized to cancel this order');
    }

    if (order.status === 'filled' || order.status === 'cancelled') {
      throw new Error(`Cannot cancel order in status: ${order.status}`);
    }

    order.status = 'cancelled';
    order.updatedAt = Date.now();
    
    this.emit('orderStatus', order);
    return order;
  }

  // Get orders for a user
  getOrders(userId: string, status?: string): Order[] {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .filter(order => !status || order.status === status)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get positions for a user
  getPositions(userId: string): Position[] {
    return this.positions.get(userId) || [];
  }

  // Get portfolio for a user
  getPortfolio(userId: string): Portfolio {
    let portfolio = this.portfolios.get(userId);
    if (!portfolio) {
      portfolio = {
        userId,
        totalValue: 100000, // Starting cash
        cashBalance: 100000,
        positions: [],
        dayPnL: 0,
        totalPnL: 0,
        buyingPower: 100000,
        marginUsed: 0,
        lastUpdated: Date.now()
      };
      this.portfolios.set(userId, portfolio);
    }
    
    // Update portfolio values with current market prices
    this.updatePortfolioValues(portfolio);
    return portfolio;
  }

  private validateOrder(userId: string, orderRequest: any): { valid: boolean; error?: string } {
    // Check if symbol has market data
    const marketData = marketDataService.getCurrentPrice(orderRequest.symbol);
    if (!marketData) {
      return { valid: false, error: `No market data available for ${orderRequest.symbol}` };
    }

    // Check buying power for buy orders
    if (orderRequest.side === 'buy') {
      const portfolio = this.getPortfolio(userId);
      const estimatedCost = orderRequest.quantity * (orderRequest.price || marketData.price);
      
      if (estimatedCost > portfolio.cashBalance) {
        return { valid: false, error: 'Insufficient buying power' };
      }
    }

    // Check position for sell orders
    if (orderRequest.side === 'sell') {
      const positions = this.getPositions(userId);
      const position = positions.find(p => p.symbol === orderRequest.symbol);
      
      if (!position || position.quantity < orderRequest.quantity) {
        return { valid: false, error: 'Insufficient position to sell' };
      }
    }

    return { valid: true };
  }

  private async executeMarketOrder(order: Order): Promise<void> {
    const marketData = marketDataService.getCurrentPrice(order.symbol);
    if (!marketData) {
      order.status = 'rejected';
      order.updatedAt = Date.now();
      this.emit('orderStatus', order);
      return;
    }

    // Use bid/ask prices for more realistic execution
    const executionPrice = order.side === 'buy' ? marketData.ask || marketData.price : marketData.bid || marketData.price;
    
    await this.executeOrder(order, order.quantity, executionPrice);
  }

  private async executeOrder(order: Order, quantity: number, price: number): Promise<void> {
    const commission = this.calculateCommission(quantity, price);
    
    // Create execution report
    const execution: ExecutionReport = {
      orderId: order.id,
      executionId: `exec_${this.nextExecutionId++}`,
      symbol: order.symbol,
      side: order.side,
      quantity,
      price,
      timestamp: Date.now(),
      commission,
      fees: 0
    };

    // Update order
    order.filledQuantity += quantity;
    order.averagePrice = ((order.averagePrice * (order.filledQuantity - quantity)) + (price * quantity)) / order.filledQuantity;
    order.status = order.filledQuantity >= order.quantity ? 'filled' : 'partially_filled';
    order.updatedAt = Date.now();

    // Update position and portfolio
    await this.updatePosition(order.userId, order.symbol, order.side, quantity, price, commission);

    // Emit events
    this.emit('execution', execution);
    this.emit('orderStatus', order);
  }

  private async updatePosition(userId: string, symbol: string, side: 'buy' | 'sell', quantity: number, price: number, commission: number): Promise<void> {
    const userPositions = this.positions.get(userId) || [];
    let position = userPositions.find(p => p.symbol === symbol);

    if (!position) {
      position = {
        userId,
        symbol,
        quantity: 0,
        averagePrice: 0,
        marketValue: 0,
        unrealizedPnL: 0,
        realizedPnL: 0,
        lastUpdated: Date.now()
      };
      userPositions.push(position);
    }

    const portfolio = this.getPortfolio(userId);

    if (side === 'buy') {
      // Update average price
      const totalCost = (position.quantity * position.averagePrice) + (quantity * price);
      position.quantity += quantity;
      position.averagePrice = totalCost / position.quantity;
      
      // Update cash balance
      portfolio.cashBalance -= (quantity * price + commission);
    } else {
      // Calculate realized P&L
      const realizedPnL = (price - position.averagePrice) * quantity - commission;
      position.realizedPnL += realizedPnL;
      position.quantity -= quantity;
      
      // Update cash balance
      portfolio.cashBalance += (quantity * price - commission);
      
      // If position is closed, remove it
      if (position.quantity <= 0) {
        const index = userPositions.indexOf(position);
        userPositions.splice(index, 1);
      }
    }

    position.lastUpdated = Date.now();
    this.positions.set(userId, userPositions);
    
    // Update portfolio
    this.updatePortfolioValues(portfolio);
    this.emit('positionUpdate', position);
  }

  private updatePortfolioValues(portfolio: Portfolio): void {
    const positions = this.getPositions(portfolio.userId);
    let totalMarketValue = 0;
    let totalUnrealizedPnL = 0;

    positions.forEach(position => {
      const marketData = marketDataService.getCurrentPrice(position.symbol);
      if (marketData) {
        position.marketValue = position.quantity * marketData.price;
        position.unrealizedPnL = (marketData.price - position.averagePrice) * position.quantity;
        totalMarketValue += position.marketValue;
        totalUnrealizedPnL += position.unrealizedPnL;
      }
    });

    portfolio.totalValue = portfolio.cashBalance + totalMarketValue;
    portfolio.totalPnL = totalUnrealizedPnL + positions.reduce((sum, p) => sum + p.realizedPnL, 0);
    portfolio.buyingPower = portfolio.cashBalance; // Simplified - in reality would include margin
    portfolio.lastUpdated = Date.now();

    this.portfolios.set(portfolio.userId, portfolio);
    this.emit('portfolioUpdate', portfolio);
  }

  private calculateCommission(quantity: number, price: number): number {
    // Simple commission structure: $0.005 per share, minimum $1
    return Math.max(quantity * 0.005, 1.0);
  }

  private setupOrderMatching(): void {
    // Simple order matching for limit orders
    setInterval(() => {
      this.matchLimitOrders();
    }, 1000);

    // Listen for price updates to trigger stop orders
    marketDataService.on('priceUpdate', (marketData) => {
      this.checkStopOrders(marketData);
    });
  }

  private matchLimitOrders(): void {
    const pendingOrders = Array.from(this.orders.values())
      .filter(order => order.status === 'pending' && (order.type === 'limit' || order.type === 'stop_limit'));

    pendingOrders.forEach(order => {
      const marketData = marketDataService.getCurrentPrice(order.symbol);
      if (!marketData || !order.price) return;

      let shouldExecute = false;

      if (order.side === 'buy' && marketData.ask && marketData.ask <= order.price) {
        shouldExecute = true;
      } else if (order.side === 'sell' && marketData.bid && marketData.bid >= order.price) {
        shouldExecute = true;
      }

      if (shouldExecute) {
        this.executeOrder(order, order.quantity, order.price);
      }
    });
  }

  private checkStopOrders(marketData: any): void {
    const stopOrders = Array.from(this.orders.values())
      .filter(order => order.status === 'pending' && 
               order.symbol === marketData.symbol && 
               (order.type === 'stop' || order.type === 'stop_limit') && 
               order.stopPrice);

    stopOrders.forEach(order => {
      let shouldTrigger = false;

      if (order.side === 'buy' && marketData.price >= order.stopPrice!) {
        shouldTrigger = true;
      } else if (order.side === 'sell' && marketData.price <= order.stopPrice!) {
        shouldTrigger = true;
      }

      if (shouldTrigger) {
        if (order.type === 'stop') {
          // Convert to market order
          order.type = 'market';
          this.executeMarketOrder(order);
        } else {
          // Convert to limit order
          order.type = 'limit';
        }
      }
    });
  }

  // Get real-time streaming data for positions
  streamPortfolio(userId: string): Portfolio {
    const portfolio = this.getPortfolio(userId);
    
    // Subscribe to price updates for all positions
    const symbols = portfolio.positions.map(p => p.symbol);
    if (symbols.length > 0) {
      marketDataService.subscribe(symbols);
    }

    return portfolio;
  }

  // Clean up
  destroy(): void {
    this.removeAllListeners();
  }
}

export const tradingService = new TradingService();