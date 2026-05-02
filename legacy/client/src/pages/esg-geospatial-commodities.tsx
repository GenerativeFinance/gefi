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
  ArrowLeft, Upload, TrendingUp, TrendingDown, Map, Satellite, 
  Globe, Eye, AlertTriangle, Download, Settings, RefreshCw, 
  FileText, Share2, Target, Zap, Activity, LineChart, 
  Thermometer, Droplets, Wind, Sun, Cloud, MapPin, Layers,
  BarChart3, PieChart, Calendar, Clock, Gauge, TreePine,
  Factory, Truck, Ship, Plane, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { useLocation } from 'wouter';
import Layout from '@/components/layout/Layout';

export default function ESGGeospatialCommodities() {
  const [, setLocation] = useLocation();
  const [selectedCommodity, setSelectedCommodity] = useState('wheat');
  const [timeHorizon, setTimeHorizon] = useState([90]);
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [analysisMode, setAnalysisMode] = useState('supply-risk');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState('ndvi');

  // Commodities data
  const commodities = [
    { id: 'wheat', name: 'Wheat', price: 685.50, change: -2.3, status: 'moderate_risk' },
    { id: 'corn', name: 'Corn', price: 425.75, change: 1.8, status: 'low_risk' },
    { id: 'oil', name: 'Crude Oil', price: 82.45, change: -0.9, status: 'high_risk' },
    { id: 'coffee', name: 'Coffee', price: 158.20, change: 3.2, status: 'moderate_risk' },
    { id: 'gold', name: 'Gold', price: 1985.40, change: 0.7, status: 'low_risk' },
    { id: 'copper', name: 'Copper', price: 8250.80, change: -1.4, status: 'high_risk' }
  ];

  // Satellite data sources
  const dataSources = [
    { id: 'nasa', name: 'NASA EarthData', status: 'connected', coverage: 'Global', cost: 'Free' },
    { id: 'copernicus', name: 'ESA Copernicus', status: 'connected', coverage: 'Global', cost: 'Free' },
    { id: 'google-earth', name: 'Google Earth Engine', status: 'connected', coverage: 'Global', cost: '$$' },
    { id: 'planet', name: 'Planet Labs', status: 'disconnected', coverage: 'High-res', cost: '$$$' }
  ];

  // Geographic regions
  const regions = [
    { id: 'global', name: 'Global View', coordinates: [0, 0] },
    { id: 'north-america', name: 'North America', coordinates: [45, -100] },
    { id: 'south-america', name: 'South America', coordinates: [-15, -60] },
    { id: 'europe', name: 'Europe', coordinates: [50, 10] },
    { id: 'africa', name: 'Africa', coordinates: [0, 20] },
    { id: 'asia', name: 'Asia', coordinates: [35, 100] },
    { id: 'oceania', name: 'Oceania', coordinates: [-25, 140] }
  ];

  // Analysis factors
  const analysisFactors = [
    { id: 'vegetation', name: 'Vegetation Health (NDVI)', importance: 0.28, trend: 'declining' },
    { id: 'temperature', name: 'Temperature Anomalies', importance: 0.24, trend: 'rising' },
    { id: 'precipitation', name: 'Rainfall Patterns', importance: 0.22, trend: 'irregular' },
    { id: 'deforestation', name: 'Deforestation Rate', importance: 0.18, trend: 'accelerating' },
    { id: 'soil-health', name: 'Soil Moisture', importance: 0.08, trend: 'stable' }
  ];

  // Forecast data
  const forecastData = [
    { date: '2024-01-15', actual: 685.50, forecast: null, confidence: null },
    { date: '2024-02-15', actual: null, forecast: 692.80, confidence: 0.87 },
    { date: '2024-03-15', actual: null, forecast: 701.20, confidence: 0.82 },
    { date: '2024-04-15', actual: null, forecast: 715.60, confidence: 0.78 },
    { date: '2024-05-15', actual: null, forecast: 728.90, confidence: 0.74 }
  ];

  // Supply chain risk indicators
  const supplyChainRisks = [
    {
      location: 'Ukraine',
      commodity: 'Wheat',
      risk: 'high',
      type: 'geopolitical',
      impact: 'Production disruption - 30M tons affected',
      coordinates: [48.3794, 31.1656]
    },
    {
      location: 'Brazil',
      commodity: 'Coffee',
      risk: 'moderate',
      type: 'climate',
      impact: 'Drought conditions affecting 15% of crop',
      coordinates: [-14.2350, -51.9253]
    },
    {
      location: 'Australia',
      commodity: 'Wheat',
      risk: 'low',
      type: 'environmental',
      impact: 'Favorable growing conditions',
      coordinates: [-25.2744, 133.7751]
    },
    {
      location: 'Indonesia',
      commodity: 'Palm Oil',
      risk: 'high',
      type: 'esg',
      impact: 'Deforestation concerns - ESG compliance risk',
      coordinates: [-0.7893, 113.9213]
    }
  ];

  // ESG risk factors
  const esgRisks = [
    {
      factor: 'Deforestation Rate',
      score: 7.2,
      trend: 'worsening',
      regions: ['Brazil', 'Indonesia', 'DRC'],
      impact: 'High'
    },
    {
      factor: 'Water Scarcity',
      score: 6.8,
      trend: 'stable',
      regions: ['California', 'Australia', 'India'],
      impact: 'Moderate'
    },
    {
      factor: 'Carbon Emissions',
      score: 5.4,
      trend: 'improving',
      regions: ['US', 'China', 'EU'],
      impact: 'Low'
    },
    {
      factor: 'Biodiversity Loss',
      score: 8.1,
      trend: 'worsening',
      regions: ['Amazon', 'Congo Basin', 'SE Asia'],
      impact: 'High'
    }
  ];

  // Satellite layers
  const satelliteLayers = [
    { id: 'ndvi', name: 'Vegetation Index (NDVI)', color: 'green' },
    { id: 'temperature', name: 'Surface Temperature', color: 'red' },
    { id: 'precipitation', name: 'Precipitation', color: 'blue' },
    { id: 'soil-moisture', name: 'Soil Moisture', color: 'brown' },
    { id: 'deforestation', name: 'Deforestation Areas', color: 'orange' }
  ];

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      'high': 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100',
      'moderate': 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-100',
      'low': 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100'
    };
    return colors[risk] || colors['moderate'];
  };

  const getTrendColor = (trend: string) => {
    const colors: Record<string, string> = {
      'improving': 'text-green-600',
      'stable': 'text-blue-600',
      'declining': 'text-orange-600',
      'worsening': 'text-red-600',
      'rising': 'text-red-600',
      'irregular': 'text-purple-600',
      'accelerating': 'text-red-600'
    };
    return colors[trend] || colors['stable'];
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'connected': 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100',
      'disconnected': 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100',
      'processing': 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-100'
    };
    return colors[status] || colors['disconnected'];
  };

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6 p-3 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation('/ai-models')}
              className="flex items-center gap-2 self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to AI Models
            </Button>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Satellite className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                ESG & Geospatial AI Commodities Forecasting
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1">
                Intelligence dashboard combining satellite imagery analysis with commodity price forecasting
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Badge variant={isAnalyzing ? "default" : "secondary"} className="flex items-center gap-1 text-xs md:text-sm px-2">
              {isAnalyzing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Eye className="w-3 h-3" />}
              <span className="hidden md:inline">{isAnalyzing ? 'Analyzing Imagery...' : 'Ready for Analysis'}</span>
              <span className="md:hidden">{isAnalyzing ? 'Analyzing...' : 'Ready'}</span>
            </Badge>
            <Button
              variant={isAnalyzing ? "destructive" : "default"}
              onClick={() => setIsAnalyzing(!isAnalyzing)}
              className="flex items-center gap-2 text-sm"
              size="sm"
            >
              {isAnalyzing ? <RefreshCw className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              <span className="hidden md:inline">{isAnalyzing ? 'Stop Analysis' : 'Start Analysis'}</span>
              <span className="md:hidden">{isAnalyzing ? 'Stop' : 'Start'}</span>
            </Button>
          </div>
        </div>

        {/* Commodity Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {commodities.map((commodity) => (
            <Card 
              key={commodity.id} 
              className={`cursor-pointer transition-all ${selectedCommodity === commodity.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedCommodity(commodity.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-sm font-medium">{commodity.name}</div>
                <div className="text-lg font-bold">${commodity.price}</div>
                <div className={`text-sm flex items-center justify-center gap-1 ${commodity.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {commodity.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {commodity.change >= 0 ? '+' : ''}{commodity.change}%
                </div>
                <Badge className={getRiskColor(commodity.status)} variant="outline">
                  {commodity.status.replace('_', ' ')}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="w-5 h-5" />
                  Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Primary Commodity</Label>
                  <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {commodities.map((commodity) => (
                        <SelectItem key={commodity.id} value={commodity.id}>
                          {commodity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Geographic Focus</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Satellite Data Sources</Label>
                  {dataSources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between text-sm">
                      <span>{source.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(source.status)}>
                          {source.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{source.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Geospatial Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Analysis Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Analysis Mode</Label>
                  <Select value={analysisMode} onValueChange={setAnalysisMode}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supply-risk">Supply Risk Assessment</SelectItem>
                      <SelectItem value="price-forecast">Price Forecasting</SelectItem>
                      <SelectItem value="esg-compliance">ESG Compliance</SelectItem>
                      <SelectItem value="climate-impact">Climate Impact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Time Horizon: {timeHorizon[0]} days</Label>
                  <Slider
                    value={timeHorizon}
                    onValueChange={setTimeHorizon}
                    max={365}
                    min={30}
                    step={30}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 Month</span>
                    <span>1 Year</span>
                  </div>
                </div>

                <div>
                  <Label>Satellite Layer</Label>
                  <Select value={selectedLayer} onValueChange={setSelectedLayer}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {satelliteLayers.map((layer) => (
                        <SelectItem key={layer.id} value={layer.id}>
                          {layer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Include Climate Data</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>ESG Risk Overlay</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Real-time Updates</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Scenario Testing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Climate Scenario</Label>
                  <Select defaultValue="current">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current Conditions</SelectItem>
                      <SelectItem value="el-nino">El Niño Event</SelectItem>
                      <SelectItem value="la-nina">La Niña Event</SelectItem>
                      <SelectItem value="warming-2c">Global Warming +2°C</SelectItem>
                      <SelectItem value="drought">Severe Drought</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Trade Impact</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal Trade</SelectItem>
                      <SelectItem value="sanctions">Trade Sanctions</SelectItem>
                      <SelectItem value="tariffs">Increased Tariffs</SelectItem>
                      <SelectItem value="embargo">Export Embargo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="map" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="map">Geospatial Map</TabsTrigger>
                <TabsTrigger value="forecast">Price Forecast</TabsTrigger>
                <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
                <TabsTrigger value="time-series">Time Series</TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Interactive Satellite Imagery Map
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed mb-4">
                      <div className="text-center">
                        <Map className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                        <div className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Global Satellite Imagery View
                        </div>
                        <div className="text-sm text-gray-500 mb-3">
                          {selectedLayer.replace('-', ' ').toUpperCase()} layer for {selectedRegion.replace('-', ' ')} region
                        </div>
                        <div className="flex items-center justify-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span>Healthy</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                            <span>Moderate</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                            <span>At Risk</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          Time Lapse
                        </Button>
                        <Button variant="outline" size="sm">
                          <Layers className="w-4 h-4 mr-1" />
                          Layer Options
                        </Button>
                      </div>
                      <div className="text-sm text-gray-500">
                        Last updated: 2 hours ago
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="forecast" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5" />
                      AI-Powered Commodity Price Forecast
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed mb-4">
                      <div className="text-center">
                        <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {commodities.find(c => c.id === selectedCommodity)?.name} Price Forecast
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Historical data + AI predictions with confidence bands
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">+4.2%</div>
                        <div className="text-sm text-gray-500">30-day forecast</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">87%</div>
                        <div className="text-sm text-gray-500">Confidence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">High</div>
                        <div className="text-sm text-gray-500">Volatility Risk</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="supply-chain" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Supply Chain Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed mb-4">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Supply Chain Risk Map
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Production hubs, export routes, and disruption signals
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {supplyChainRisks.slice(0, 3).map((risk, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge className={getRiskColor(risk.risk)}>
                              {risk.risk}
                            </Badge>
                            <div>
                              <div className="font-medium">{risk.location}</div>
                              <div className="text-sm text-gray-500">{risk.type}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{risk.commodity}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="time-series" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Historical Analysis & Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Multi-factor Time Series Analysis
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Satellite metrics vs commodity prices over time
                        </div>
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
                  Forecast Drivers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisFactors.map((factor, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{factor.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{(factor.importance * 100).toFixed(0)}%</span>
                          <span className={`text-xs ${getTrendColor(factor.trend)}`}>
                            {factor.trend}
                          </span>
                        </div>
                      </div>
                      <Progress value={factor.importance * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  ESG Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {esgRisks.map((risk, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-sm">{risk.factor}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{risk.score}/10</span>
                          <Badge variant="outline" className={getTrendColor(risk.trend)}>
                            {risk.trend}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Impact: {risk.impact} | Regions: {risk.regions.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Real-time Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <div className="text-sm font-medium text-red-800 dark:text-red-200">Drought Alert</div>
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-300 mt-1">
                    Wheat belt experiencing severe drought conditions. 15% production impact expected.
                  </div>
                </div>
                
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <div className="text-sm font-medium text-orange-800 dark:text-orange-200">ESG Warning</div>
                  </div>
                  <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                    Increased deforestation detected in palm oil regions. Compliance risk elevated.
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Positive Signal</div>
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Favorable rainfall patterns detected in corn belt. Yield projections upgraded.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export & Reporting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Forecast Data
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Map className="w-4 h-4 mr-2" />
                  Download Maps
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  ESG Risk Report
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}