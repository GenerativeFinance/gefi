import { useState } from "react";
import { Calendar, Database, TrendingUp, BarChart3, DollarSign, Globe, PieChart, Clock, Info, Download, Play, Pause } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/layout/Layout";

// Data source configurations
const DATA_SOURCES = [
  {
    id: 'stocks-us',
    name: 'Stock Data (US)',
    icon: TrendingUp,
    status: 'active',
    description: 'S&P 500, NASDAQ, NYSE stocks with real-time and historical data',
    coverage: '95%',
    dataPoints: '2.5M',
    startYear: 2010,
    endYear: 2025,
    updateFrequency: 'Real-time',
    limitations: null,
    sampleSymbols: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA']
  },
  {
    id: 'crypto',
    name: 'Crypto Data',
    icon: BarChart3,
    status: 'active',
    description: 'Top 100 cryptocurrencies with orderbook and trade data',
    coverage: '100%',
    dataPoints: '1.8M',
    startYear: 2015,
    endYear: 2025,
    updateFrequency: 'Real-time',
    limitations: null,
    sampleSymbols: ['BTC', 'ETH', 'BNB', 'ADA', 'SOL']
  },
  {
    id: 'forex',
    name: 'Forex Data',
    icon: Globe,
    status: 'active',
    description: 'Major currency pairs with tick-level precision',
    coverage: '90%',
    dataPoints: '5.2M',
    startYear: 2012,
    endYear: 2025,
    updateFrequency: 'Real-time',
    limitations: null,
    sampleSymbols: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CHF']
  },
  {
    id: 'options',
    name: 'Options Data',
    icon: PieChart,
    status: 'limited',
    description: 'Options chains for major US stocks',
    coverage: '60%',
    dataPoints: '800K',
    startYear: 2018,
    endYear: 2025,
    updateFrequency: 'Daily',
    limitations: 'Limited: Partial coverage for 2024, delayed data for some strikes',
    sampleSymbols: ['AAPL Options', 'SPY Options', 'QQQ Options', 'TSLA Options']
  },
  {
    id: 'commodities',
    name: 'Commodities Data',
    icon: DollarSign,
    status: 'limited',
    description: 'Gold, oil, agricultural futures and spot prices',
    coverage: '70%',
    dataPoints: '420K',
    startYear: 2016,
    endYear: 2024,
    updateFrequency: 'Daily',
    limitations: 'Limited: 2025 data not yet available, some futures contracts missing',
    sampleSymbols: ['GOLD', 'WTI', 'CORN', 'WHEAT', 'SILVER']
  },
  {
    id: 'bonds',
    name: 'Fixed Income Data',
    icon: Database,
    status: 'coming-soon',
    description: 'Government and corporate bonds, yield curves',
    coverage: '0%',
    dataPoints: '0',
    startYear: 2020,
    endYear: 2025,
    updateFrequency: 'Coming Q2 2025',
    limitations: 'Coming Soon: Full bond market coverage planned for Q2 2025',
    sampleSymbols: ['10Y Treasury', 'Corporate Bonds', 'Municipal Bonds']
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</Badge>;
    case 'limited':
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Limited</Badge>;
    case 'coming-soon':
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">Coming Soon</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

export default function MarketData() {
  const [selectedSource, setSelectedSource] = useState('stocks-us');
  const [dateRange, setDateRange] = useState([2020, 2025]);
  const [customStartYear, setCustomStartYear] = useState(2020);
  const [customEndYear, setCustomEndYear] = useState(2025);
  const [previewMode, setPreviewMode] = useState<'range' | 'custom'>('range');
  const [isStreaming, setIsStreaming] = useState(false);

  const selectedData = DATA_SOURCES.find(source => source.id === selectedSource);
  const availableYears = selectedData ? selectedData.endYear - selectedData.startYear + 1 : 0;
  const selectedYears = previewMode === 'range' 
    ? dateRange[1] - dateRange[0] + 1 
    : customEndYear - customStartYear + 1;
  const estimatedDataPoints = selectedData 
    ? Math.floor(parseInt(selectedData.dataPoints.replace(/[^\d]/g, '')) * (selectedYears / availableYears))
    : 0;

  const handleStreamToggle = () => {
    setIsStreaming(!isStreaming);
  };

  return (
    <Layout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Market Data</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Access comprehensive financial data for AI model development and backtesting
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={isStreaming ? "destructive" : "default"}
            onClick={handleStreamToggle}
            className="flex items-center gap-2"
          >
            {isStreaming ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isStreaming ? 'Stop Stream' : 'Start Stream'}
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">6</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Data Sources</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">10.9M</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Data Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">4</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Real-time Sources</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">86%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Coverage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Data Sources</TabsTrigger>
          <TabsTrigger value="range">Date Range</TabsTrigger>
          <TabsTrigger value="preview">Data Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {DATA_SOURCES.map((source) => {
              const IconComponent = source.icon;
              return (
                <Card key={source.id} className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedSource === source.id ? 'ring-2 ring-blue-500' : ''
                }`} onClick={() => setSelectedSource(source.id)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                        <div>
                          <CardTitle className="text-lg">{source.name}</CardTitle>
                          <CardDescription className="mt-1">{source.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(source.status)}
                        {source.limitations && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-amber-500" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{source.limitations}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Coverage</p>
                        <p className="font-semibold">{source.coverage}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Data Points</p>
                        <p className="font-semibold">{source.dataPoints}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Date Range</p>
                        <p className="font-semibold">{source.startYear} - {source.endYear}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Update Frequency</p>
                        <p className="font-semibold">{source.updateFrequency}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Sample Symbols</p>
                      <div className="flex flex-wrap gap-1">
                        {source.sampleSymbols.map((symbol) => (
                          <Badge key={symbol} variant="outline" className="text-xs">
                            {symbol}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="range" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historical Data Range Configuration</CardTitle>
              <CardDescription>
                Select the date range for your data analysis and model training
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Data Source</Label>
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATA_SOURCES.map((source) => (
                      <SelectItem key={source.id} value={source.id}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Date Range Mode</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={previewMode === 'range' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('range')}
                    >
                      Slider
                    </Button>
                    <Button
                      variant={previewMode === 'custom' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('custom')}
                    >
                      Custom
                    </Button>
                  </div>
                </div>

                {previewMode === 'range' ? (
                  <div className="space-y-4">
                    <Label>Year Range: {dateRange[0]} - {dateRange[1]}</Label>
                    <Slider
                      value={dateRange}
                      onValueChange={setDateRange}
                      min={selectedData?.startYear || 2010}
                      max={selectedData?.endYear || 2025}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{selectedData?.startYear || 2010}</span>
                      <span>{selectedData?.endYear || 2025}</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-year">Start Year</Label>
                      <Input
                        id="start-year"
                        type="number"
                        value={customStartYear}
                        onChange={(e) => setCustomStartYear(parseInt(e.target.value) || 2020)}
                        min={selectedData?.startYear || 2010}
                        max={selectedData?.endYear || 2025}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-year">End Year</Label>
                      <Input
                        id="end-year"
                        type="number"
                        value={customEndYear}
                        onChange={(e) => setCustomEndYear(parseInt(e.target.value) || 2025)}
                        min={selectedData?.startYear || 2010}
                        max={selectedData?.endYear || 2025}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Data Preview Summary */}
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                <h4 className="font-semibold mb-3">Data Preview Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Selected Years</p>
                    <p className="font-semibold">{selectedYears} years</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Est. Data Points</p>
                    <p className="font-semibold">{estimatedDataPoints.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Coverage</p>
                    <p className="font-semibold">{selectedData?.coverage || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Status</p>
                    <div className="mt-1">
                      {selectedData && getStatusBadge(selectedData.status)}
                    </div>
                  </div>
                </div>
                {selectedData?.limitations && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      {selectedData.limitations}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Availability Preview</CardTitle>
              <CardDescription>
                Visual representation of data completeness across the selected time range
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {selectedData && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{selectedData.name}</h4>
                      {getStatusBadge(selectedData.status)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Data Completeness</span>
                        <span>{selectedData.coverage}</span>
                      </div>
                      <Progress value={parseInt(selectedData.coverage)} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-2">
                        <p className="text-gray-600 dark:text-gray-400">Available Range</p>
                        <p className="font-semibold">{selectedData.startYear} - {selectedData.endYear}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-600 dark:text-gray-400">Total Data Points</p>
                        <p className="font-semibold">{selectedData.dataPoints}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-600 dark:text-gray-400">Update Frequency</p>
                        <p className="font-semibold">{selectedData.updateFrequency}</p>
                      </div>
                    </div>

                    {/* Year-by-year availability visualization */}
                    <div className="space-y-3">
                      <h5 className="font-medium">Year-by-Year Availability</h5>
                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {Array.from({ length: selectedData.endYear - selectedData.startYear + 1 }, (_, i) => {
                          const year = selectedData.startYear + i;
                          const isInRange = previewMode === 'range' 
                            ? year >= dateRange[0] && year <= dateRange[1]
                            : year >= customStartYear && year <= customEndYear;
                          const isLimited = selectedData.status === 'limited' && year >= 2024;
                          const isComingSoon = selectedData.status === 'coming-soon';
                          
                          return (
                            <div
                              key={year}
                              className={`p-2 text-center text-xs rounded border ${
                                isComingSoon ? 'bg-gray-100 text-gray-400 border-gray-300' :
                                isLimited ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                'bg-green-100 text-green-800 border-green-300'
                              } ${isInRange ? 'ring-2 ring-blue-500' : ''}`}
                            >
                              {year}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                          <span>Complete</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                          <span>Limited</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                          <span>Coming Soon</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 border-2 border-blue-500 rounded"></div>
                          <span>Selected Range</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </Layout>
  );
}