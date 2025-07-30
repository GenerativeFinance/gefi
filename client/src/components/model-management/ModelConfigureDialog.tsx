import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Settings, Zap, Shield, Bell, Target, BarChart3 } from "lucide-react";

interface ModelConfigureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  model: {
    id: number;
    name: string;
    category: string;
    status: string;
  };
}

export default function ModelConfigureDialog({ isOpen, onClose, model }: ModelConfigureDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [config, setConfig] = useState({
    // General Settings
    isActive: true,
    autoRebalance: false,
    riskThreshold: [75],
    maxAllocation: [25],
    minConfidence: [80],
    
    // Trading Settings
    maxDailyTrades: "10",
    stopLoss: [5],
    takeProfit: [15],
    tradingHours: "market",
    
    // Risk Management
    positionSizing: "fixed",
    maxDrawdown: [10],
    volatilityFilter: true,
    correlationLimit: [0.7],
    
    // Alerts & Notifications
    performanceAlerts: true,
    riskAlerts: true,
    tradeAlerts: false,
    emailNotifications: true,
    pushNotifications: false,
    
    // Advanced Settings
    backtestPeriod: "1y",
    rebalanceFrequency: "weekly",
    dataRefreshRate: "1h",
    apiRateLimit: "1000"
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (configData: typeof config) => {
      return await apiRequest("PUT", `/api/ai-models/${model.id}/configure`, configData);
    },
    onSuccess: () => {
      toast({
        title: "Configuration Updated",
        description: `${model.name} has been successfully configured.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/ai-models"] });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update model configuration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateConfigMutation.mutate(config);
  };

  const resetToDefaults = () => {
    setConfig({
      isActive: true,
      autoRebalance: false,
      riskThreshold: [75],
      maxAllocation: [25],
      minConfidence: [80],
      maxDailyTrades: "10",
      stopLoss: [5],
      takeProfit: [15],
      tradingHours: "market",
      positionSizing: "fixed",
      maxDrawdown: [10],
      volatilityFilter: true,
      correlationLimit: [0.7],
      performanceAlerts: true,
      riskAlerts: true,
      tradeAlerts: false,
      emailNotifications: true,
      pushNotifications: false,
      backtestPeriod: "1y",
      rebalanceFrequency: "weekly",
      dataRefreshRate: "1h",
      apiRateLimit: "1000"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configure {model.name}
            <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
              {model.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="risk">Risk</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Model Status & Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isActive">Model Active</Label>
                      <p className="text-sm text-muted-foreground">Enable/disable model execution</p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={config.isActive}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, isActive: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoRebalance">Auto Rebalancing</Label>
                      <p className="text-sm text-muted-foreground">Automatically rebalance portfolio</p>
                    </div>
                    <Switch
                      id="autoRebalance"
                      checked={config.autoRebalance}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoRebalance: checked }))}
                    />
                  </div>

                  <div>
                    <Label>Portfolio Allocation Limit (%)</Label>
                    <div className="px-3 py-2">
                      <Slider
                        value={config.maxAllocation}
                        onValueChange={(value) => setConfig(prev => ({ ...prev, maxAllocation: value }))}
                        max={100}
                        min={1}
                        step={1}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>1%</span>
                        <span>{config.maxAllocation[0]}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Minimum Confidence Level (%)</Label>
                    <div className="px-3 py-2">
                      <Slider
                        value={config.minConfidence}
                        onValueChange={(value) => setConfig(prev => ({ ...prev, minConfidence: value }))}
                        max={100}
                        min={50}
                        step={5}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>50%</span>
                        <span>{config.minConfidence[0]}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rebalanceFreq">Rebalance Frequency</Label>
                      <Select value={config.rebalanceFrequency} onValueChange={(value) => setConfig(prev => ({ ...prev, rebalanceFrequency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dataRefresh">Data Refresh Rate</Label>
                      <Select value={config.dataRefreshRate} onValueChange={(value) => setConfig(prev => ({ ...prev, dataRefreshRate: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5m">5 minutes</SelectItem>
                          <SelectItem value="15m">15 minutes</SelectItem>
                          <SelectItem value="1h">1 hour</SelectItem>
                          <SelectItem value="4h">4 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trading" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Trading Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxDailyTrades">Max Daily Trades</Label>
                      <Input
                        id="maxDailyTrades"
                        type="number"
                        value={config.maxDailyTrades}
                        onChange={(e) => setConfig(prev => ({ ...prev, maxDailyTrades: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tradingHours">Trading Hours</Label>
                      <Select value={config.tradingHours} onValueChange={(value) => setConfig(prev => ({ ...prev, tradingHours: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">Market Hours</SelectItem>
                          <SelectItem value="extended">Extended Hours</SelectItem>
                          <SelectItem value="24/7">24/7</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Stop Loss (%)</Label>
                    <div className="px-3 py-2">
                      <Slider
                        value={config.stopLoss}
                        onValueChange={(value) => setConfig(prev => ({ ...prev, stopLoss: value }))}
                        max={20}
                        min={1}
                        step={0.5}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>1%</span>
                        <span>{config.stopLoss[0]}%</span>
                        <span>20%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Take Profit (%)</Label>
                    <div className="px-3 py-2">
                      <Slider
                        value={config.takeProfit}
                        onValueChange={(value) => setConfig(prev => ({ ...prev, takeProfit: value }))}
                        max={50}
                        min={5}
                        step={1}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>5%</span>
                        <span>{config.takeProfit[0]}%</span>
                        <span>50%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="positionSizing">Position Sizing Method</Label>
                    <Select value={config.positionSizing} onValueChange={(value) => setConfig(prev => ({ ...prev, positionSizing: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="percentage">Percentage Based</SelectItem>
                        <SelectItem value="volatility">Volatility Adjusted</SelectItem>
                        <SelectItem value="kelly">Kelly Criterion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Risk Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Risk Threshold (%)</Label>
                    <div className="px-3 py-2">
                      <Slider
                        value={config.riskThreshold}
                        onValueChange={(value) => setConfig(prev => ({ ...prev, riskThreshold: value }))}
                        max={100}
                        min={10}
                        step={5}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>10%</span>
                        <span>{config.riskThreshold[0]}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Maximum Drawdown (%)</Label>
                    <div className="px-3 py-2">
                      <Slider
                        value={config.maxDrawdown}
                        onValueChange={(value) => setConfig(prev => ({ ...prev, maxDrawdown: value }))}
                        max={30}
                        min={5}
                        step={1}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>5%</span>
                        <span>{config.maxDrawdown[0]}%</span>
                        <span>30%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Correlation Limit</Label>
                    <div className="px-3 py-2">
                      <Slider
                        value={config.correlationLimit}
                        onValueChange={(value) => setConfig(prev => ({ ...prev, correlationLimit: value }))}
                        max={1}
                        min={0}
                        step={0.1}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>0.0</span>
                        <span>{config.correlationLimit[0]}</span>
                        <span>1.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="volatilityFilter">Volatility Filter</Label>
                      <p className="text-sm text-muted-foreground">Filter out high volatility periods</p>
                    </div>
                    <Switch
                      id="volatilityFilter"
                      checked={config.volatilityFilter}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, volatilityFilter: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications & Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="perfAlerts">Performance Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified of significant performance changes</p>
                      </div>
                      <Switch
                        id="perfAlerts"
                        checked={config.performanceAlerts}
                        onCheckedChange={(checked) => setConfig(prev => ({ ...prev, performanceAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="riskAlerts">Risk Alerts</Label>
                        <p className="text-sm text-muted-foreground">Alerts when risk thresholds are exceeded</p>
                      </div>
                      <Switch
                        id="riskAlerts"
                        checked={config.riskAlerts}
                        onCheckedChange={(checked) => setConfig(prev => ({ ...prev, riskAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="tradeAlerts">Trade Execution Alerts</Label>
                        <p className="text-sm text-muted-foreground">Notifications for each trade executed</p>
                      </div>
                      <Switch
                        id="tradeAlerts"
                        checked={config.tradeAlerts}
                        onCheckedChange={(checked) => setConfig(prev => ({ ...prev, tradeAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifs">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                      </div>
                      <Switch
                        id="emailNotifs"
                        checked={config.emailNotifications}
                        onCheckedChange={(checked) => setConfig(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pushNotifs">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Real-time push notifications</p>
                      </div>
                      <Switch
                        id="pushNotifs"
                        checked={config.pushNotifications}
                        onCheckedChange={(checked) => setConfig(prev => ({ ...prev, pushNotifications: checked }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={updateConfigMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {updateConfigMutation.isPending ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}