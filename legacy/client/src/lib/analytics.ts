// Analytics service for tracking user interactions with AI models
export interface ModelView {
  modelId: number;
  modelName: string;
  timestamp: number;
  timeSpent: number; // in seconds
  category: string;
  price: number;
}

export interface ModelSubscription {
  modelId: number;
  modelName: string;
  timestamp: number;
  plan: string; // monthly, annual, enterprise
  price: number;
  category: string;
}

export interface ModelInteraction {
  modelId: number;
  modelName: string;
  timestamp: number;
  action: 'view' | 'click' | 'subscribe' | 'bookmark';
  category: string;
  price?: number;
}

export interface UserAnalytics {
  totalViews: number;
  totalTimeSpent: number; // in minutes
  totalSubscriptions: number;
  favoriteCategory: string;
  averageModelPrice: number;
  lastActivity: number;
  viewHistory: ModelView[];
  subscriptionHistory: ModelSubscription[];
  interactionHistory: ModelInteraction[];
}

class AnalyticsService {
  private readonly STORAGE_KEY = 'gefi_user_analytics';
  private readonly VIEW_STORAGE_KEY = 'gefi_model_views';
  private readonly SUBSCRIPTION_STORAGE_KEY = 'gefi_model_subscriptions';
  private readonly INTERACTION_STORAGE_KEY = 'gefi_model_interactions';
  
  private startTime: number = 0;
  private currentModelId: number | null = null;

  // Initialize analytics data
  private initializeAnalytics(): UserAnalytics {
    return {
      totalViews: 0,
      totalTimeSpent: 0,
      totalSubscriptions: 0,
      favoriteCategory: '',
      averageModelPrice: 0,
      lastActivity: Date.now(),
      viewHistory: [],
      subscriptionHistory: [],
      interactionHistory: []
    };
  }

  // Get analytics data from localStorage
  getAnalytics(): UserAnalytics {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return this.initializeAnalytics();
    } catch (error) {
      console.error('Error loading analytics:', error);
      return this.initializeAnalytics();
    }
  }

  // Save analytics data to localStorage
  private saveAnalytics(analytics: UserAnalytics): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(analytics));
    } catch (error) {
      console.error('Error saving analytics:', error);
    }
  }

  // Track model view start
  startModelView(modelId: number, modelName: string, category: string): void {
    this.startTime = Date.now();
    this.currentModelId = modelId;
    
    // Track interaction
    this.trackInteraction(modelId, modelName, 'view', category);
  }

  // Track model view end and calculate time spent
  endModelView(modelId: number, modelName: string, category: string, price: number): void {
    if (this.currentModelId !== modelId || this.startTime === 0) {
      return;
    }

    const timeSpent = Math.round((Date.now() - this.startTime) / 1000); // in seconds
    const analytics = this.getAnalytics();

    const modelView: ModelView = {
      modelId,
      modelName,
      timestamp: Date.now(),
      timeSpent,
      category,
      price
    };

    // Update analytics
    analytics.totalViews += 1;
    analytics.totalTimeSpent += Math.round(timeSpent / 60); // convert to minutes
    analytics.lastActivity = Date.now();
    analytics.viewHistory.unshift(modelView);

    // Keep only last 100 views
    if (analytics.viewHistory.length > 100) {
      analytics.viewHistory = analytics.viewHistory.slice(0, 100);
    }

    // Update favorite category
    analytics.favoriteCategory = this.calculateFavoriteCategory(analytics.viewHistory);

    // Update average model price
    analytics.averageModelPrice = this.calculateAveragePrice(analytics.viewHistory);

    this.saveAnalytics(analytics);
    this.startTime = 0;
    this.currentModelId = null;
  }

  // Track model subscription
  trackSubscription(modelId: number, modelName: string, plan: string, price: number, category: string): void {
    const analytics = this.getAnalytics();

    const subscription: ModelSubscription = {
      modelId,
      modelName,
      timestamp: Date.now(),
      plan,
      price,
      category
    };

    analytics.totalSubscriptions += 1;
    analytics.lastActivity = Date.now();
    analytics.subscriptionHistory.unshift(subscription);

    // Keep only last 50 subscriptions
    if (analytics.subscriptionHistory.length > 50) {
      analytics.subscriptionHistory = analytics.subscriptionHistory.slice(0, 50);
    }

    // Track interaction
    this.trackInteraction(modelId, modelName, 'subscribe', category, price);

    this.saveAnalytics(analytics);
  }

  // Track general interactions
  trackInteraction(modelId: number, modelName: string, action: 'view' | 'click' | 'subscribe' | 'bookmark', category: string, price?: number): void {
    const analytics = this.getAnalytics();

    const interaction: ModelInteraction = {
      modelId,
      modelName,
      timestamp: Date.now(),
      action,
      category,
      price
    };

    analytics.interactionHistory.unshift(interaction);
    analytics.lastActivity = Date.now();

    // Keep only last 200 interactions
    if (analytics.interactionHistory.length > 200) {
      analytics.interactionHistory = analytics.interactionHistory.slice(0, 200);
    }

    this.saveAnalytics(analytics);
  }

  // Calculate favorite category based on views
  private calculateFavoriteCategory(views: ModelView[]): string {
    if (views.length === 0) return '';

    const categoryCount: Record<string, number> = {};
    views.forEach(view => {
      categoryCount[view.category] = (categoryCount[view.category] || 0) + 1;
    });

    return Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
  }

  // Calculate average price of viewed models
  private calculateAveragePrice(views: ModelView[]): number {
    if (views.length === 0) return 0;
    
    const totalPrice = views.reduce((sum, view) => sum + view.price, 0);
    return Math.round(totalPrice / views.length);
  }

  // Get daily analytics for charts
  getDailyAnalytics(days: number = 7): Array<{date: string, views: number, subscriptions: number, timeSpent: number}> {
    const analytics = this.getAnalytics();
    const now = new Date();
    const dailyData: Array<{date: string, views: number, subscriptions: number, timeSpent: number}> = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dateStr = date.toISOString().split('T')[0];
      const dayStart = new Date(date.setHours(0, 0, 0, 0)).getTime();
      const dayEnd = new Date(date.setHours(23, 59, 59, 999)).getTime();

      const dayViews = analytics.viewHistory.filter(view => 
        view.timestamp >= dayStart && view.timestamp <= dayEnd
      );

      const daySubscriptions = analytics.subscriptionHistory.filter(sub => 
        sub.timestamp >= dayStart && sub.timestamp <= dayEnd
      );

      const dayTimeSpent = dayViews.reduce((sum, view) => sum + view.timeSpent, 0) / 60; // convert to minutes

      dailyData.push({
        date: dateStr,
        views: dayViews.length,
        subscriptions: daySubscriptions.length,
        timeSpent: Math.round(dayTimeSpent)
      });
    }

    return dailyData;
  }

  // Get category analytics for pie charts
  getCategoryAnalytics(): Array<{category: string, views: number, subscriptions: number}> {
    const analytics = this.getAnalytics();
    const categoryData: Record<string, {views: number, subscriptions: number}> = {};

    // Count views by category
    analytics.viewHistory.forEach(view => {
      if (!categoryData[view.category]) {
        categoryData[view.category] = { views: 0, subscriptions: 0 };
      }
      categoryData[view.category].views += 1;
    });

    // Count subscriptions by category
    analytics.subscriptionHistory.forEach(sub => {
      if (!categoryData[sub.category]) {
        categoryData[sub.category] = { views: 0, subscriptions: 0 };
      }
      categoryData[sub.category].subscriptions += 1;
    });

    return Object.entries(categoryData)
      .map(([category, data]) => ({
        category,
        views: data.views,
        subscriptions: data.subscriptions
      }))
      .sort((a, b) => b.views - a.views);
  }

  // Get top viewed models
  getTopModels(limit: number = 5): Array<{modelId: number, modelName: string, views: number, category: string}> {
    const analytics = this.getAnalytics();
    const modelData: Record<number, {modelName: string, views: number, category: string}> = {};

    analytics.viewHistory.forEach(view => {
      if (!modelData[view.modelId]) {
        modelData[view.modelId] = {
          modelName: view.modelName,
          views: 0,
          category: view.category
        };
      }
      modelData[view.modelId].views += 1;
    });

    return Object.entries(modelData)
      .map(([modelId, data]) => ({
        modelId: parseInt(modelId),
        modelName: data.modelName,
        views: data.views,
        category: data.category
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  // Clear all analytics data
  clearAnalytics(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.VIEW_STORAGE_KEY);
    localStorage.removeItem(this.SUBSCRIPTION_STORAGE_KEY);
    localStorage.removeItem(this.INTERACTION_STORAGE_KEY);
  }

  // Generate sample analytics data for demo purposes
  generateSampleData(): void {
    const sampleCategories = ['Risk Assessment', 'Portfolio Management', 'Algorithmic Trading', 'Market Analysis', 'Financial Forecasting'];
    const sampleModels = [
      'Quantum Risk Predictor', 'Alpha Generation Engine', 'Smart Asset Allocator', 
      'Market Sentiment Analyzer', 'Portfolio Optimizer Pro', 'Risk Monitor AI',
      'Trading Signal Generator', 'Credit Risk Assessor', 'Volatility Predictor'
    ];

    const analytics = this.initializeAnalytics();
    const now = Date.now();

    // Generate last 30 days of sample data
    for (let i = 0; i < 30; i++) {
      const dayOffset = i * 24 * 60 * 60 * 1000;
      const viewsPerDay = Math.floor(Math.random() * 10) + 1;

      for (let j = 0; j < viewsPerDay; j++) {
        const randomModel = sampleModels[Math.floor(Math.random() * sampleModels.length)];
        const randomCategory = sampleCategories[Math.floor(Math.random() * sampleCategories.length)];
        const randomPrice = Math.floor(Math.random() * 500) + 99;
        const timeSpent = Math.floor(Math.random() * 300) + 30; // 30-330 seconds

        const modelView: ModelView = {
          modelId: Math.floor(Math.random() * 100) + 1,
          modelName: randomModel,
          timestamp: now - dayOffset - (j * 60 * 60 * 1000),
          timeSpent,
          category: randomCategory,
          price: randomPrice
        };

        analytics.viewHistory.push(modelView);
        analytics.totalViews += 1;
        analytics.totalTimeSpent += Math.round(timeSpent / 60);

        // Occasional subscriptions
        if (Math.random() < 0.1) {
          const subscription: ModelSubscription = {
            modelId: modelView.modelId,
            modelName: modelView.modelName,
            timestamp: modelView.timestamp + 1000,
            plan: ['monthly', 'annual'][Math.floor(Math.random() * 2)],
            price: randomPrice,
            category: randomCategory
          };

          analytics.subscriptionHistory.push(subscription);
          analytics.totalSubscriptions += 1;
        }
      }
    }

    analytics.favoriteCategory = this.calculateFavoriteCategory(analytics.viewHistory);
    analytics.averageModelPrice = this.calculateAveragePrice(analytics.viewHistory);
    analytics.lastActivity = now;

    this.saveAnalytics(analytics);
  }
}

export const analyticsService = new AnalyticsService();