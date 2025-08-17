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
  ArrowLeft, Leaf, Globe, TrendingUp, TrendingDown, BarChart3, 
  Target, Brain, Zap, Download, Settings, RefreshCw, FileText, 
  Shield, Database, Satellite, ChevronRight, DollarSign, AlertCircle,
  Activity, LineChart, Gauge, Share2, Thermometer, Factory, 
  CheckCircle, AlertTriangle, Droplets, Wind, Sun, Cloud,
  TreePine, Recycle, Building, Car, Plane, Ship
} from 'lucide-react';
import { useLocation } from 'wouter';
import Layout from '@/components/layout/Layout';

export default function ESGClimateRisk() {
  const [, setLocation] = useLocation();
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [timeHorizon, setTimeHorizon] = useState('2030');
  const [riskThreshold, setRiskThreshold] = useState([75]);
  const [selectedSectors, setSelectedSectors] = useState(['energy', 'automotive', 'real-estate']);
  const [climateScenario, setClimateScenario] = useState('rcp45');
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  // Climate risk data
  const climateMetrics = {
    globalTemperatureRise: 1.2,
    carbonConcentration: 421,
    seaLevelRise: 3.4,
    extremeWeatherEvents: 89,
    biodiversityLoss: 23.7,
    renewableAdoption: 31.2
  };

  // Sector risk analysis
  const sectorRisks = [
    {
      sector: 'Energy',
      physicalRisk: 85,
      transitionRisk: 92,
      overallRisk: 'Very High',
      carbonIntensity: 487.2,
      strandedAssets: 34.7,
      adaptationCost: 245000000,
      esgScore: 42,
      trend: 'deteriorating'
    },
    {
      sector: 'Automotive',
      physicalRisk: 67,
      transitionRisk: 89,
      overallRisk: 'High',
      carbonIntensity: 167.8,
      strandedAssets: 28.3,
      adaptationCost: 89000000,
      esgScore: 68,
      trend: 'improving'
    },
    {
      sector: 'Real Estate',
      physicalRisk: 78,
      transitionRisk: 56,
      overallRisk: 'High',
      carbonIntensity: 89.4,
      strandedAssets: 19.8,
      adaptationCost: 156000000,
      esgScore: 71,
      trend: 'stable'
    },
    {
      sector: 'Technology',
      physicalRisk: 34,
      transitionRisk: 23,
      overallRisk: 'Low',
      carbonIntensity: 12.7,
      strandedAssets: 2.1,
      adaptationCost: 15000000,
      esgScore: 87,
      trend: 'improving'
    }
  ];

  // Regional climate risks
  const regionalRisks = [
    {
      region: 'North America',
      temperatureRisk: 68,
      precipitationRisk: 45,
      seaLevelRisk: 72,
      extremeWeatherRisk: 81,
      overallScore: 67
    },
    {
      region: 'Europe',
      temperatureRisk: 72,
      precipitationRisk: 58,
      seaLevelRisk: 65,
      extremeWeatherRisk: 69,
      overallScore: 66
    },
    {
      region: 'Asia Pacific',
      temperatureRisk: 89,
      precipitationRisk: 92,
      seaLevelRisk: 94,
      extremeWeatherRisk: 96,
      overallScore: 93
    },
    {
      region: 'Latin America',
      temperatureRisk: 78,
      precipitationRisk: 84,
      seaLevelRisk: 67,
      extremeWeatherRisk: 87,
      overallScore: 79
    }
  ];

  // ESG investment opportunities
  const esgOpportunities = [
    {
      category: 'Renewable Energy',
      projectedReturn: 18.4,
      riskScore: 'Medium',
      marketSize: '$2.8T',
      growthRate: 23.7,
      regulatorySupport: 'Strong',
      technologyReadiness: 'Mature'
    },
    {
      category: 'Electric Vehicles',
      projectedReturn: 22.1,
      riskScore: 'Medium-High',
      marketSize: '$388B',
      growthRate: 29.4,
      regulatorySupport: 'Strong',
      technologyReadiness: 'Scaling'
    },
    {
      category: 'Carbon Capture',
      projectedReturn: 15.8,
      riskScore: 'High',
      marketSize: '$6.2B',
      growthRate: 45.2,
      regulatorySupport: 'Emerging',
      technologyReadiness: 'Early'
    },
    {
      category: 'Sustainable Agriculture',
      projectedReturn: 12.6,
      riskScore: 'Medium',
      marketSize: '$156B',
      growthRate: 14.8,
      regulatorySupport: 'Moderate',
      technologyReadiness: 'Mature'
    }
  ];

  // Regulatory compliance tracking
  const complianceFrameworks = [
    {
      framework: 'EU Taxonomy',
      complianceScore: 78,
      status: 'Compliant',
      nextReview: '2024-Q4',
      requirements: 15,
      metRequirements: 12
    },
    {
      framework: 'TCFD',
      complianceScore: 92,
      status: 'Fully Compliant',
      nextReview: '2024-Q3',
      requirements: 11,
      metRequirements: 11
    },
    {
      framework: 'SASB',
      complianceScore: 85,
      status: 'Compliant',
      nextReview: '2024-Q4',
      requirements: 23,
      metRequirements: 20
    },
    {
      framework: 'SFDR',
      complianceScore: 67,
      status: 'Partially Compliant',
      nextReview: '2024-Q3',
      requirements: 18,
      metRequirements: 12
    }
  ];

  const getRiskColor = (risk: string | number) => {
    if (typeof risk === 'string') {
      const colors: Record<string, string> = {
        'Very High': 'text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-100',
        'High': 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100',
        'Medium-High': 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-100',
        'Medium': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100',
        'Low': 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100'
      };
      return colors[risk] || colors['Medium'];
    }
    
    if (risk >= 80) return 'text-red-600';
    if (risk >= 60) return 'text-orange-600';
    if (risk >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-100';
    if (score >= 50) return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-100';
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'deteriorating') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
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
                <Leaf className="w-8 h-8 text-green-600" />
                ESG & Climate Risk Intelligence
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                AI-powered climate risk assessment with satellite imagery analysis and regulatory compliance tracking
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              <Satellite className="w-3 h-3 mr-1" />
              Satellite Data Active
            </Badge>
            <Button
              variant={isRealTimeEnabled ? "destructive" : "default"}
              onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
              className="flex items-center gap-2"
            >
              {isRealTimeEnabled ? <RefreshCw className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
              {isRealTimeEnabled ? 'Pause Updates' : 'Enable Updates'}
            </Button>
          </div>
        </div>

        {/* Climate Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Thermometer className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">+{climateMetrics.globalTemperatureRise}°C</div>
              <div className="text-xs text-gray-500">Temperature Rise</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Cloud className="w-6 h-6 text-gray-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-600">{climateMetrics.carbonConcentration}</div>
              <div className="text-xs text-gray-500">CO₂ PPM</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{climateMetrics.seaLevelRise}mm</div>
              <div className="text-xs text-gray-500">Sea Level Rise</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Wind className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{climateMetrics.extremeWeatherEvents}</div>
              <div className="text-xs text-gray-500">Extreme Events</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TreePine className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{climateMetrics.biodiversityLoss}%</div>
              <div className="text-xs text-gray-500">Biodiversity Loss</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Sun className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{climateMetrics.renewableAdoption}%</div>
              <div className="text-xs text-gray-500">Renewable Energy</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Analysis Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Region</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global</SelectItem>
                      <SelectItem value="north-america">North America</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                      <SelectItem value="latin-america">Latin America</SelectItem>
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
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2030">2030</SelectItem>
                      <SelectItem value="2040">2040</SelectItem>
                      <SelectItem value="2050">2050</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Climate Scenario</Label>
                  <Select value={climateScenario} onValueChange={setClimateScenario}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rcp26">RCP 2.6 (Optimistic)</SelectItem>
                      <SelectItem value="rcp45">RCP 4.5 (Moderate)</SelectItem>
                      <SelectItem value="rcp60">RCP 6.0 (High)</SelectItem>
                      <SelectItem value="rcp85">RCP 8.5 (Extreme)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Risk Threshold: {riskThreshold[0]}%</Label>
                  <Slider
                    value={riskThreshold}
                    onValueChange={setRiskThreshold}
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
                  Sector Selection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: 'energy', name: 'Energy', icon: Factory },
                    { id: 'automotive', name: 'Automotive', icon: Car },
                    { id: 'real-estate', name: 'Real Estate', icon: Building },
                    { id: 'aviation', name: 'Aviation', icon: Plane },
                    { id: 'shipping', name: 'Shipping', icon: Ship }
                  ].map((sector) => (
                    <div key={sector.id} className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <sector.icon className="w-4 h-4" />
                        {sector.name}
                      </Label>
                      <Switch 
                        checked={selectedSectors.includes(sector.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSectors([...selectedSectors, sector.id]);
                          } else {
                            setSelectedSectors(selectedSectors.filter(s => s !== sector.id));
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="sector-risk" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="sector-risk">Sector Risk</TabsTrigger>
                <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
                <TabsTrigger value="opportunities">ESG Opportunities</TabsTrigger>
                <TabsTrigger value="satellite">Satellite Data</TabsTrigger>
              </TabsList>

              <TabsContent value="sector-risk" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Sector Climate Risk Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sectorRisks.map((sector, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="font-bold text-lg">{sector.sector}</div>
                              {getTrendIcon(sector.trend)}
                              <Badge className={getRiskColor(sector.overallRisk)}>
                                {sector.overallRisk} Risk
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600 dark:text-gray-400">ESG Score</div>
                              <div className={`text-2xl font-bold ${getRiskColor(sector.esgScore)}`}>
                                {sector.esgScore}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600 dark:text-gray-400">Physical Risk</div>
                              <div className={`font-bold ${getRiskColor(sector.physicalRisk)}`}>
                                {sector.physicalRisk}/100
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600 dark:text-gray-400">Transition Risk</div>
                              <div className={`font-bold ${getRiskColor(sector.transitionRisk)}`}>
                                {sector.transitionRisk}/100
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600 dark:text-gray-400">Carbon Intensity</div>
                              <div className="font-bold">{sector.carbonIntensity} tCO₂e/M$</div>
                            </div>
                            <div>
                              <div className="text-gray-600 dark:text-gray-400">Stranded Assets</div>
                              <div className="font-bold text-red-600">{sector.strandedAssets}%</div>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Adaptation Cost</div>
                            <div className="text-lg font-bold">
                              ${(sector.adaptationCost / 1000000).toFixed(0)}M
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="regional" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Regional Climate Risk Heatmap
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {regionalRisks.map((region, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="font-bold text-lg">{region.region}</div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600 dark:text-gray-400">Overall Risk</div>
                              <div className={`text-2xl font-bold ${getRiskColor(region.overallScore)}`}>
                                {region.overallScore}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-3 text-sm">
                            <div className="text-center">
                              <div className="text-gray-600 dark:text-gray-400">Temperature</div>
                              <div className={`font-bold ${getRiskColor(region.temperatureRisk)}`}>
                                {region.temperatureRisk}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-gray-600 dark:text-gray-400">Precipitation</div>
                              <div className={`font-bold ${getRiskColor(region.precipitationRisk)}`}>
                                {region.precipitationRisk}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-gray-600 dark:text-gray-400">Sea Level</div>
                              <div className={`font-bold ${getRiskColor(region.seaLevelRisk)}`}>
                                {region.seaLevelRisk}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-gray-600 dark:text-gray-400">Extreme Weather</div>
                              <div className={`font-bold ${getRiskColor(region.extremeWeatherRisk)}`}>
                                {region.extremeWeatherRisk}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="opportunities" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      ESG Investment Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {esgOpportunities.map((opportunity, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="font-bold text-lg">{opportunity.category}</div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                {opportunity.projectedReturn}%
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Projected Return</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600 dark:text-gray-400">Market Size</div>
                              <div className="font-bold">{opportunity.marketSize}</div>
                            </div>
                            <div>
                              <div className="text-gray-600 dark:text-gray-400">Growth Rate</div>
                              <div className="font-bold text-green-600">+{opportunity.growthRate}%</div>
                            </div>
                            <div>
                              <div className="text-gray-600 dark:text-gray-400">Risk Level</div>
                              <Badge className={getRiskColor(opportunity.riskScore)}>
                                {opportunity.riskScore}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                            <div>
                              <div className="text-gray-600 dark:text-gray-400">Regulatory Support</div>
                              <div className="font-bold">{opportunity.regulatorySupport}</div>
                            </div>
                            <div>
                              <div className="text-gray-600 dark:text-gray-400">Technology Readiness</div>
                              <div className="font-bold">{opportunity.technologyReadiness}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="satellite" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Satellite className="w-5 h-5" />
                      Satellite Imagery Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed">
                      <div className="text-center">
                        <Satellite className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Real-time Satellite Imagery Dashboard
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Deforestation tracking, crop yield analysis, and infrastructure monitoring
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">-2.4%</div>
                        <div className="text-sm text-red-700">Forest Cover Change</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">+8.7%</div>
                        <div className="text-sm text-green-700">Renewable Infrastructure</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">+12.3%</div>
                        <div className="text-sm text-orange-700">Urban Expansion</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Compliance & Insights */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Regulatory Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceFrameworks.map((framework, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-sm">{framework.framework}</div>
                        <div className={`text-lg font-bold ${getRiskColor(framework.complianceScore)}`}>
                          {framework.complianceScore}%
                        </div>
                      </div>
                      <Badge className={getComplianceColor(framework.complianceScore)} variant="secondary">
                        {framework.status}
                      </Badge>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {framework.metRequirements}/{framework.requirements} requirements met
                      </div>
                      <div className="text-xs text-gray-500">
                        Next review: {framework.nextReview}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Climate Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="text-sm font-medium text-red-800 dark:text-red-200">High Risk Alert</div>
                  <div className="text-xs text-red-700 dark:text-red-300 mt-1">
                    Energy sector facing severe transition risks. Consider diversification into renewables.
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="text-sm font-medium text-green-800 dark:text-green-200">Investment Opportunity</div>
                  <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Electric vehicle sector showing strong growth trajectory with favorable regulatory environment.
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Compliance Update</div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    New EU Taxonomy requirements effective Q4 2024. Review portfolio alignment needed.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Reports & Export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Climate Risk Report
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  ESG Compliance Report
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Analysis
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Satellite className="w-4 h-4 mr-2" />
                  Satellite Data Export
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}