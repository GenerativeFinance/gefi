import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, MessageSquare, TrendingUp, TrendingDown, Hash, Clock, 
  Target, Brain, Zap, Download, Settings, RefreshCw, FileText, 
  Webhook, Database, Globe, ChevronRight, DollarSign, AlertCircle,
  Twitter, Circle, Newspaper, Volume2, Eye, ThumbsUp, ThumbsDown,
  Activity, BarChart3, PieChart, LineChart, Gauge, Share2
} from 'lucide-react';
import { useLocation } from 'wouter';
import Layout from '@/components/layout/Layout';

export default function SocialSentimentTrading() {
  const [, setLocation] = useLocation();
  const [selectedAssets, setSelectedAssets] = useState(['TSLA', 'AAPL', 'BTC']);
  const [sentimentGranularity, setSentimentGranularity] = useState('document');
  const [timeHorizon, setTimeHorizon] = useState('1day');
  const [isRealTime, setIsRealTime] = useState(true);
  const [selectedModel, setSelectedModel] = useState('transformer');
  const [confidenceThreshold, setConfidenceThreshold] = useState([75]);

  // Real-time sentiment data
  const [sentimentData, setSentimentData] = useState([
    {
      ticker: 'TSLA',
      sentiment: 0.78,
      mentionVolume: 15420,
      priceChange: 2.4,
      confidence: 89,
      topKeywords: ['earnings', 'delivery', 'growth'],
      signal: 'BUY',
      sources: { twitter: 8540, reddit: 4120, news: 2760 }
    },
    {
      ticker: 'AAPL',
      sentiment: 0.45,
      mentionVolume: 9830,
      priceChange: -0.8,
      confidence: 76,
      topKeywords: ['iphone', 'sales', 'china'],
      signal: 'HOLD',
      sources: { twitter: 5200, reddit: 2630, news: 2000 }
    },
    {
      ticker: 'BTC',
      sentiment: 0.62,
      mentionVolume: 22150,
      priceChange: 1.9,
      confidence: 82,
      topKeywords: ['etf', 'institutional', 'adoption'],
      signal: 'BUY',
      sources: { twitter: 12800, reddit: 6350, news: 3000 }
    }
  ]);

  const topMentions = [
    {
      ticker: 'TSLA',
      text: 'Tesla delivery numbers beat expectations again! 🚗⚡',
      sentiment: 0.91,
      source: 'Twitter',
      timestamp: '2 min ago',
      influence: 'High'
    },
    {
      ticker: 'BTC',
      text: 'Blackrock Bitcoin ETF approval signals institutional adoption',
      sentiment: 0.85,
      source: 'News',
      timestamp: '5 min ago',
      influence: 'Very High'
    },
    {
      ticker: 'AAPL',
      text: 'iPhone sales in China showing weakness amid competition',
      sentiment: 0.25,
      source: 'Reddit',
      timestamp: '8 min ago',
      influence: 'Medium'
    }
  ];

  const keywordInfluence = [
    { word: 'earnings beat', sentiment: 0.95, frequency: 2840, impact: 'Very Positive' },
    { word: 'short squeeze', sentiment: 0.89, frequency: 1560, impact: 'Positive' },
    { word: 'regulatory concerns', sentiment: 0.15, frequency: 980, impact: 'Negative' },
    { word: 'bankruptcy fears', sentiment: 0.08, frequency: 420, impact: 'Very Negative' },
    { word: 'institutional buying', sentiment: 0.87, frequency: 1120, impact: 'Positive' }
  ];

  const marketImpactForecast = {
    volatilityProbability: 78,
    directionBias: 'Bullish',
    timeframe: '24 hours',
    confidence: 85,
    expectedMoveRange: { low: -2.1, high: 4.3 }
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.7) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100';
    if (sentiment >= 0.5) return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-100';
    if (sentiment >= 0.3) return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-100';
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100';
  };

  const getSignalColor = (signal: string) => {
    const colors: Record<string, string> = {
      'BUY': 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100',
      'SELL': 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100',
      'HOLD': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100'
    };
    return colors[signal] || colors['HOLD'];
  };

  const getInfluenceColor = (influence: string) => {
    const colors: Record<string, string> = {
      'Very High': 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-100',
      'High': 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100',
      'Medium': 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-100',
      'Low': 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300'
    };
    return colors[influence] || colors['Low'];
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation('/ai-models')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to AI Models
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-8 h-8 text-blue-600" />
                Social Sentiment Trading Intelligence
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Real-time social media sentiment analysis using LSTMs and Transformers for trading signals
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              <Activity className="w-3 h-3 mr-1" />
              Live Stream Active
            </Badge>
            <Button
              variant={isRealTime ? "destructive" : "default"}
              onClick={() => setIsRealTime(!isRealTime)}
              className="flex items-center gap-2"
            >
              {isRealTime ? <RefreshCw className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
              {isRealTime ? 'Stop Stream' : 'Start Stream'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="twitter" className="flex items-center gap-2">
                      <Twitter className="w-4 h-4 text-blue-500" />
                      Twitter/X
                    </Label>
                    <Switch id="twitter" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reddit" className="flex items-center gap-2">
                      <Circle className="w-4 h-4 text-orange-500" />
                      Reddit
                    </Label>
                    <Switch id="reddit" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="news" className="flex items-center gap-2">
                      <Newspaper className="w-4 h-4 text-gray-600" />
                      News APIs
                    </Label>
                    <Switch id="news" defaultChecked />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="custom-data">Upload Custom Dataset</Label>
                  <Input 
                    id="custom-data"
                    type="file"
                    accept=".csv,.json"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Model Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>NLP Model</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lstm">LSTM</SelectItem>
                      <SelectItem value="transformer">Transformer</SelectItem>
                      <SelectItem value="finbert">FinBERT</SelectItem>
                      <SelectItem value="hybrid">Hybrid (Sentiment + Embeddings)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Sentiment Granularity</Label>
                  <Select value={sentimentGranularity} onValueChange={setSentimentGranularity}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">Document-level</SelectItem>
                      <SelectItem value="sentence">Sentence-level</SelectItem>
                      <SelectItem value="word">Word-level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Time Horizon</Label>
                  <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="intraday">Intraday</SelectItem>
                      <SelectItem value="1day">1-Day Rolling</SelectItem>
                      <SelectItem value="7day">7-Day Rolling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Confidence Threshold: {confidenceThreshold[0]}%</Label>
                  <Slider
                    value={confidenceThreshold}
                    onValueChange={setConfidenceThreshold}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Asset Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Input placeholder="Add ticker (e.g., TSLA, BTC)" />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedAssets.map((asset) => (
                      <Badge key={asset} variant="outline" className="flex items-center gap-1">
                        {asset}
                        <button className="ml-1 text-xs">×</button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="sentiment" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="sentiment">Sentiment Timeline</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="comparison">Asset Comparison</TabsTrigger>
                <TabsTrigger value="forecast">Market Impact</TabsTrigger>
              </TabsList>

              <TabsContent value="sentiment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5" />
                      Sentiment Timeline vs Price Movement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed">
                      <div className="text-center">
                        <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive Sentiment vs Price Chart
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Real-time correlation analysis with overlaid price movements
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="keywords" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="w-5 h-5" />
                      Keyword Influence Heatmap
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {keywordInfluence.map((keyword, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge className={getSentimentColor(keyword.sentiment)}>
                              {keyword.word}
                            </Badge>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {keyword.frequency} mentions
                            </div>
                          </div>
                          <Badge variant="outline" className={
                            keyword.impact.includes('Positive') ? 'border-green-500 text-green-700' :
                            keyword.impact.includes('Negative') ? 'border-red-500 text-red-700' :
                            'border-gray-500 text-gray-700'
                          }>
                            {keyword.impact}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comparison" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Asset Sentiment Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sentimentData.map((asset, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="text-lg font-bold">{asset.ticker}</div>
                            <Badge className={getSentimentColor(asset.sentiment)}>
                              {(asset.sentiment * 100).toFixed(0)}% Sentiment
                            </Badge>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {asset.mentionVolume.toLocaleString()} mentions
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${asset.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {asset.priceChange >= 0 ? '+' : ''}{asset.priceChange}%
                            </div>
                            <Badge className={getSignalColor(asset.signal)}>
                              {asset.signal}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="forecast" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="w-5 h-5" />
                      Market Impact Forecast
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-3xl font-bold text-orange-600">
                          {marketImpactForecast.volatilityProbability}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Volatility Probability
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {marketImpactForecast.directionBias}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Direction Bias
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Expected Move Range (24h)</div>
                      <div className="text-lg font-bold text-blue-900 dark:text-blue-100 mt-1">
                        {marketImpactForecast.expectedMoveRange.low}% to {marketImpactForecast.expectedMoveRange.high}%
                      </div>
                      <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Confidence: {marketImpactForecast.confidence}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Insights Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Top Mentions & Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {topMentions.map((mention, index) => (
                      <div key={index} className="p-3 border rounded-lg text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{mention.ticker}</Badge>
                          <Badge className={getInfluenceColor(mention.influence)} variant="secondary">
                            {mention.influence}
                          </Badge>
                        </div>
                        <div className="text-gray-800 dark:text-gray-200 mb-2">
                          {mention.text}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{mention.source}</span>
                          <span>{mention.timestamp}</span>
                        </div>
                        <div className="mt-1">
                          <Badge className={getSentimentColor(mention.sentiment)} variant="secondary">
                            {(mention.sentiment * 100).toFixed(0)}% Sentiment
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Insights & Signals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="text-sm font-medium text-green-800 dark:text-green-200">Strong Buy Signal</div>
                  <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                    TSLA sentiment surge driven by positive earnings commentary and delivery beat expectations.
                  </div>
                </div>
                
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="text-sm font-medium text-orange-800 dark:text-orange-200">Volatility Alert</div>
                  <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                    High chatter volume detected for BTC. Institutional adoption narratives driving momentum.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export & Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Sentiment Data
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate AI Report
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Dashboard
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Webhook className="w-4 h-4 mr-2" />
                  Setup Trading Webhooks
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}