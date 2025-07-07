import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Percent,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface ModelInfo {
  developer: string;
  totalRevenue: string;
  developerShare: number;
  platformShare: number;
  totalInvestorShares: number;
  isActive: boolean;
}

interface RevenueDistribution {
  timestamp: number;
  amount: string;
  model: string;
  developerAmount: string;
  platformAmount: string;
  investorAmount: string;
}

interface RevenueShareCardProps {
  modelInfo: ModelInfo | null;
  revenueHistory: RevenueDistribution[];
  selectedModelId: string;
  onModelSelect: (modelId: string) => void;
  onRegisterModel: (data: any) => void;
  onDistributeRevenue: (modelId: string, amount: string) => void;
  loading: boolean;
}

export default function RevenueShareCard({
  modelInfo,
  revenueHistory,
  selectedModelId,
  onModelSelect,
  onRegisterModel,
  onDistributeRevenue,
  loading
}: RevenueShareCardProps) {
  const [newModelForm, setNewModelForm] = useState({
    modelId: '',
    developer: '',
    developerShare: 70,
    platformShare: 30
  });

  const [distributeForm, setDistributeForm] = useState({
    amount: ''
  });

  const totalRevenue = parseFloat(modelInfo?.totalRevenue || '0');
  const availableShares = 100 - (modelInfo?.developerShare || 0) - (modelInfo?.platformShare || 0);

  return (
    <div className="space-y-6">
      {/* Model Registration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Register AI Model
          </CardTitle>
          <CardDescription>
            Register a new AI model for transparent revenue sharing with investors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="modelId">Model ID</Label>
              <Input
                id="modelId"
                value={newModelForm.modelId}
                onChange={(e) => setNewModelForm(prev => ({ ...prev, modelId: e.target.value }))}
                placeholder="e.g., quantum-risk-predictor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="developer">Developer Address</Label>
              <Input
                id="developer"
                value={newModelForm.developer}
                onChange={(e) => setNewModelForm(prev => ({ ...prev, developer: e.target.value }))}
                placeholder="0x..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="developerShare">Developer Share (%)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="developerShare"
                  type="number"
                  min="0"
                  max="100"
                  value={newModelForm.developerShare}
                  onChange={(e) => setNewModelForm(prev => ({ ...prev, developerShare: parseInt(e.target.value) || 0 }))}
                />
                <Percent className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="platformShare">Platform Share (%)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="platformShare"
                  type="number"
                  min="0"
                  max="100"
                  value={newModelForm.platformShare}
                  onChange={(e) => setNewModelForm(prev => ({ ...prev, platformShare: parseInt(e.target.value) || 0 }))}
                />
                <Percent className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Available for Investors:</span>
            <Badge variant="secondary">
              {100 - newModelForm.developerShare - newModelForm.platformShare}%
            </Badge>
          </div>

          <Button 
            onClick={() => onRegisterModel(newModelForm)} 
            disabled={loading || !newModelForm.modelId || !newModelForm.developer}
            className="w-full"
          >
            Register Model
          </Button>
        </CardContent>
      </Card>

      {/* Model Information */}
      {modelInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Model: {selectedModelId}
            </CardTitle>
            <CardDescription>
              Revenue sharing configuration and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Revenue Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-lg">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {totalRevenue.toFixed(4)} ETH
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Revenue</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 rounded-lg">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {modelInfo.developerShare}%
                </div>
                <p className="text-sm text-green-600 dark:text-green-400">Developer Share</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {modelInfo.totalInvestorShares}%
                </div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Investor Shares</p>
              </div>
            </div>

            {/* Share Distribution */}
            <div className="space-y-3">
              <Label>Revenue Distribution</Label>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Developer ({modelInfo.developerShare}%)</span>
                  <span>{(totalRevenue * modelInfo.developerShare / 100).toFixed(4)} ETH</span>
                </div>
                <Progress value={modelInfo.developerShare} className="h-2" />
                
                <div className="flex justify-between text-sm">
                  <span>Platform ({modelInfo.platformShare}%)</span>
                  <span>{(totalRevenue * modelInfo.platformShare / 100).toFixed(4)} ETH</span>
                </div>
                <Progress value={modelInfo.platformShare} className="h-2" />
                
                <div className="flex justify-between text-sm">
                  <span>Investors ({modelInfo.totalInvestorShares}%)</span>
                  <span>{(totalRevenue * modelInfo.totalInvestorShares / 100).toFixed(4)} ETH</span>
                </div>
                <Progress value={modelInfo.totalInvestorShares} className="h-2" />
              </div>
            </div>

            <Separator />

            {/* Distribute Revenue */}
            <div className="space-y-4">
              <Label>Distribute Revenue</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Amount in ETH"
                  value={distributeForm.amount}
                  onChange={(e) => setDistributeForm({ amount: e.target.value })}
                  type="number"
                  step="0.001"
                />
                <Button 
                  onClick={() => onDistributeRevenue(selectedModelId, distributeForm.amount)}
                  disabled={loading || !distributeForm.amount}
                >
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Distribute
                </Button>
              </div>
            </div>

            {/* Revenue History */}
            {revenueHistory.length > 0 && (
              <div className="space-y-4">
                <Label>Recent Distributions</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {revenueHistory.slice(-5).reverse().map((distribution, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(distribution.timestamp * 1000).toLocaleDateString()}
                        </span>
                      </div>
                      <Badge variant="secondary">
                        {parseFloat(distribution.amount).toFixed(4)} ETH
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Load Model Information</CardTitle>
          <CardDescription>
            Enter a model ID to view its revenue sharing details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Model ID"
              value={selectedModelId}
              onChange={(e) => onModelSelect(e.target.value)}
            />
            <Button 
              onClick={() => onModelSelect(selectedModelId)}
              disabled={loading || !selectedModelId}
            >
              Load
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}