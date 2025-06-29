import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Scale, 
  TrendingUp, 
  Target, 
  AlertCircle,
  CheckCircle,
  ArrowRightLeft,
  DollarSign,
  Clock,
  Zap,
  Settings
} from "lucide-react";

export default function RebalanceActions() {
  const [targetAllocation, setTargetAllocation] = useState({
    stocks: 70,
    bonds: 20,
    crypto: 7,
    commodities: 3
  });
  const [rebalanceThreshold, setRebalanceThreshold] = useState([5]);
  const [autoRebalance, setAutoRebalance] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: portfolio } = useQuery({
    queryKey: ["/api/portfolio"]
  });

  const { data: assets = [] } = useQuery({
    queryKey: ["/api/portfolio/assets"]
  });

  const rebalanceMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/portfolio/rebalance", data);
    },
    onSuccess: () => {
      toast({
        title: "Rebalancing Initiated",
        description: "Your portfolio rebalancing has been successfully started."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
    },
    onError: () => {
      toast({
        title: "Rebalancing Failed",
        description: "Failed to initiate portfolio rebalancing. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Mock current allocation
  const currentAllocation = {
    stocks: 75,
    bonds: 15,
    crypto: 8,
    commodities: 2
  };

  const getDrift = (current: number, target: number) => {
    return Math.abs(current - target);
  };

  const getRebalanceActions = () => {
    const actions = [];
    
    Object.entries(currentAllocation).forEach(([asset, current]) => {
      const target = targetAllocation[asset as keyof typeof targetAllocation];
      const drift = current - target;
      
      if (Math.abs(drift) >= rebalanceThreshold[0]) {
        actions.push({
          asset: asset.charAt(0).toUpperCase() + asset.slice(1),
          action: drift > 0 ? "Sell" : "Buy",
          amount: Math.abs(drift),
          value: Math.abs(drift) * (portfolio?.totalValue || 100000) / 100,
          priority: Math.abs(drift) > 10 ? "High" : Math.abs(drift) > 5 ? "Medium" : "Low"
        });
      }
    });
    
    return actions;
  };

  const rebalanceActions = getRebalanceActions();
  const totalRebalanceValue = rebalanceActions.reduce((sum, action) => sum + action.value, 0);

  const handleRebalance = () => {
    rebalanceMutation.mutate({
      targetAllocation,
      threshold: rebalanceThreshold[0],
      autoRebalance
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Scale className="h-8 w-8 text-primary" />
                Portfolio Rebalancing & Actions
              </h1>
              <p className="text-muted-foreground mt-2">
                Optimize your portfolio allocation and manage rebalancing strategies
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                onClick={handleRebalance}
                disabled={rebalanceActions.length === 0 || rebalanceMutation.isPending}
              >
                <Zap className="h-4 w-4 mr-2" />
                {rebalanceMutation.isPending ? "Rebalancing..." : "Execute Rebalance"}
              </Button>
            </div>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Drift</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.max(...Object.entries(currentAllocation).map(([key, current]) => 
                    getDrift(current, targetAllocation[key as keyof typeof targetAllocation])
                  )).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Maximum deviation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Actions Required</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rebalanceActions.length}</div>
                <p className="text-xs text-muted-foreground">
                  Trades needed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rebalance Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRebalanceValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Total transaction value
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Rebalance</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">
                  Days ago
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Target Allocation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Target Allocation
                </CardTitle>
                <CardDescription>
                  Set your desired portfolio allocation across asset classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(targetAllocation).map(([asset, value]) => (
                    <div key={asset} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium capitalize">{asset}</label>
                        <span className="text-sm font-semibold">{value}%</span>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={(newValue) => {
                          setTargetAllocation(prev => ({
                            ...prev,
                            [asset]: newValue[0]
                          }));
                        }}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Current: {currentAllocation[asset as keyof typeof currentAllocation]}%</span>
                        <span>
                          Drift: {getDrift(
                            currentAllocation[asset as keyof typeof currentAllocation], 
                            value
                          ).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Allocation</span>
                      <span className={`text-sm font-semibold ${
                        Object.values(targetAllocation).reduce((sum, val) => sum + val, 0) === 100 
                          ? "text-green-600" 
                          : "text-red-600"
                      }`}>
                        {Object.values(targetAllocation).reduce((sum, val) => sum + val, 0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rebalancing Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Rebalancing Settings
                </CardTitle>
                <CardDescription>
                  Configure automatic rebalancing parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Rebalance Threshold: {rebalanceThreshold[0]}%
                    </label>
                    <Slider
                      value={rebalanceThreshold}
                      onValueChange={setRebalanceThreshold}
                      max={20}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Trigger rebalancing when any asset class drifts by this percentage
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Auto-Rebalancing</label>
                      <p className="text-xs text-muted-foreground">
                        Automatically rebalance when threshold is reached
                      </p>
                    </div>
                    <Switch
                      checked={autoRebalance}
                      onCheckedChange={setAutoRebalance}
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Rebalancing Frequency</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm">Monthly</Button>
                      <Button variant="default" size="sm">Quarterly</Button>
                      <Button variant="outline" size="sm">Annually</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Cost Optimization</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Minimize Trading Costs</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tax-Loss Harvesting</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Required Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5" />
                Required Rebalancing Actions
              </CardTitle>
              <CardDescription>
                Specific trades needed to achieve target allocation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rebalanceActions.length > 0 ? (
                <div className="space-y-4">
                  {rebalanceActions.map((action, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          action.action === "Buy" ? "bg-green-500" : "bg-red-500"
                        }`}></div>
                        <div>
                          <div className="font-medium">
                            {action.action} {action.asset}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {action.amount.toFixed(1)}% allocation change
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${action.value.toLocaleString()}</div>
                        <Badge 
                          variant={
                            action.priority === "High" ? "destructive" : 
                            action.priority === "Medium" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {action.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="font-medium">Total Transaction Value</span>
                    <span className="text-lg font-bold">${totalRebalanceValue.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Portfolio is Balanced</h3>
                  <p className="text-muted-foreground">
                    Your current allocation is within the acceptable drift threshold.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}