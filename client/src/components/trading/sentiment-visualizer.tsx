import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, Brain, Activity, DollarSign, BarChart3, Coins, Globe, Hammer, Building } from "lucide-react";

interface SentimentData {
  score: number;
  confidence: number;
  sources: string[];
  keywords: string[];
  news_sentiment: number;
  social_sentiment: number;
  technical_sentiment: number;
}

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  assetType: 'stock' | 'crypto' | 'forex' | 'commodity' | 'index';
  marketCap?: number;
  sentiment?: SentimentData;
}

interface SentimentVisualizerProps {
  marketData: MarketData[];
  onAssetSelect?: (symbol: string) => void;
}

export default function SentimentVisualizer({ marketData, onAssetSelect }: SentimentVisualizerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'sentiment' | 'performance' | 'volume'>('sentiment');

  // Group assets by category
  const categorizedData = {
    all: marketData,
    stocks: marketData.filter(item => item.assetType === 'stock'),
    crypto: marketData.filter(item => item.assetType === 'crypto'),
    forex: marketData.filter(item => item.assetType === 'forex'),
    commodities: marketData.filter(item => item.assetType === 'commodity'),
    indices: marketData.filter(item => item.assetType === 'index')
  };

  // Sort data based on selected criteria
  const sortedData = [...(categorizedData[selectedCategory as keyof typeof categorizedData] || [])].sort((a, b) => {
    switch (sortBy) {
      case 'sentiment':
        return (b.sentiment?.score || 0) - (a.sentiment?.score || 0);
      case 'performance':
        return (b.change24h || 0) - (a.change24h || 0);
      case 'volume':
        return (b.volume || 0) - (a.volume || 0);
      default:
        return 0;
    }
  });

  const getSentimentColor = (score: number): string => {
    if (score > 0.3) return 'text-green-600 dark:text-green-400';
    if (score < -0.3) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getSentimentBadge = (score: number): { variant: any, text: string, icon: any } => {
    if (score > 0.3) return { variant: 'default', text: 'Bullish', icon: TrendingUp };
    if (score < -0.3) return { variant: 'destructive', text: 'Bearish', icon: TrendingDown };
    return { variant: 'secondary', text: 'Neutral', icon: Minus };
  };

  const getAssetIcon = (assetType: string) => {
    switch (assetType) {
      case 'stock': return Building;
      case 'crypto': return Coins;
      case 'forex': return Globe;
      case 'commodity': return Hammer;
      case 'index': return BarChart3;
      default: return Activity;
    }
  };

  const formatPrice = (price: number, assetType: string): string => {
    if (assetType === 'crypto' && price < 1) {
      return `$${price.toFixed(4)}`;
    } else if (assetType === 'forex') {
      return price.toFixed(4);
    } else {
      return `$${price.toLocaleString()}`;
    }
  };

  const formatVolume = (volume: number, assetType: string): string => {
    if (assetType === 'index') return 'N/A';
    
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(1)}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(1)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(1)}K`;
    } else {
      return volume.toLocaleString();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Real-Time Sentiment Visualizer
          </CardTitle>
          <CardDescription>
            AI-powered market sentiment analysis across all asset classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
              <TabsList className="grid w-full grid-cols-6 lg:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="stocks">Stocks</TabsTrigger>
                <TabsTrigger value="crypto">Crypto</TabsTrigger>
                <TabsTrigger value="forex">Forex</TabsTrigger>
                <TabsTrigger value="commodities">Commodities</TabsTrigger>
                <TabsTrigger value="indices">Indices</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Badge 
                  variant={sortBy === 'sentiment' ? 'default' : 'outline'} 
                  className="cursor-pointer"
                  onClick={() => setSortBy('sentiment')}
                >
                  Sentiment
                </Badge>
                <Badge 
                  variant={sortBy === 'performance' ? 'default' : 'outline'} 
                  className="cursor-pointer"
                  onClick={() => setSortBy('performance')}
                >
                  Performance
                </Badge>
                <Badge 
                  variant={sortBy === 'volume' ? 'default' : 'outline'} 
                  className="cursor-pointer"
                  onClick={() => setSortBy('volume')}
                >
                  Volume
                </Badge>
              </div>
            </div>

            {Object.keys(categorizedData).map(category => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid gap-4">
                  {sortedData.slice(0, 10).map((asset) => {
                    const sentiment = asset.sentiment;
                    const sentimentBadge = sentiment ? getSentimentBadge(sentiment.score) : null;
                    const AssetIcon = getAssetIcon(asset.assetType);
                    
                    return (
                      <Card 
                        key={asset.symbol} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => onAssetSelect?.(asset.symbol)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <AssetIcon className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <h3 className="font-semibold">{asset.symbol}</h3>
                                  <p className="text-sm text-muted-foreground capitalize">
                                    {asset.assetType}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-medium">
                                  {formatPrice(asset.price, asset.assetType)}
                                </p>
                                <p className={`text-sm ${asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {asset.change24h >= 0 ? '+' : ''}{(asset.change24h * 100).toFixed(2)}%
                                </p>
                              </div>
                              
                              <div className="text-right min-w-[80px]">
                                <p className="text-sm text-muted-foreground">Volume</p>
                                <p className="text-sm font-medium">
                                  {formatVolume(asset.volume, asset.assetType)}
                                </p>
                              </div>
                              
                              {sentiment && (
                                <div className="text-right min-w-[100px]">
                                  {sentimentBadge && (
                                    <Badge variant={sentimentBadge.variant} className="mb-1">
                                      <sentimentBadge.icon className="h-3 w-3 mr-1" />
                                      {sentimentBadge.text}
                                    </Badge>
                                  )}
                                  <p className={`text-sm font-medium ${getSentimentColor(sentiment.score)}`}>
                                    {(sentiment.score * 100).toFixed(0)}% confidence
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {sentiment && (
                            <div className="mt-4 space-y-3">
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">News</p>
                                  <div className="flex items-center gap-2">
                                    <Progress 
                                      value={(sentiment.news_sentiment + 1) * 50} 
                                      className="h-2 flex-1"
                                    />
                                    <span className={`text-xs ${getSentimentColor(sentiment.news_sentiment)}`}>
                                      {(sentiment.news_sentiment * 100).toFixed(0)}
                                    </span>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-muted-foreground">Social</p>
                                  <div className="flex items-center gap-2">
                                    <Progress 
                                      value={(sentiment.social_sentiment + 1) * 50} 
                                      className="h-2 flex-1"
                                    />
                                    <span className={`text-xs ${getSentimentColor(sentiment.social_sentiment)}`}>
                                      {(sentiment.social_sentiment * 100).toFixed(0)}
                                    </span>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-muted-foreground">Technical</p>
                                  <div className="flex items-center gap-2">
                                    <Progress 
                                      value={(sentiment.technical_sentiment + 1) * 50} 
                                      className="h-2 flex-1"
                                    />
                                    <span className={`text-xs ${getSentimentColor(sentiment.technical_sentiment)}`}>
                                      {(sentiment.technical_sentiment * 100).toFixed(0)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {sentiment.keywords.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {sentiment.keywords.slice(0, 4).map((keyword, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}