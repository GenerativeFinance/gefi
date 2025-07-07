import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Target, 
  Users, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ArrowUpRight,
  Calendar,
  Coins
} from 'lucide-react';

interface CampaignInfo {
  creator: string;
  title: string;
  description: string;
  modelId: string;
  goal: string;
  raised: string;
  deadline: number;
  status: number; // 0: Active, 1: Successful, 2: Failed, 3: Cancelled
  contributorCount: number;
  category: string;
}

interface Contribution {
  contributor: string;
  amount: string;
  timestamp: number;
  campaignId: string;
}

interface CrowdfundingCardProps {
  campaigns: CampaignInfo[];
  userContributions: Contribution[];
  onCreateCampaign: (data: any) => void;
  onContribute: (campaignId: string, amount: string) => void;
  onWithdrawFunds: (campaignId: string) => void;
  onRequestRefund: (campaignId: string) => void;
  loading: boolean;
  userAddress: string;
}

export default function CrowdfundingCard({
  campaigns,
  userContributions,
  onCreateCampaign,
  onContribute,
  onWithdrawFunds,
  onRequestRefund,
  loading,
  userAddress
}: CrowdfundingCardProps) {
  const [newCampaignForm, setNewCampaignForm] = useState({
    campaignId: '',
    title: '',
    description: '',
    modelId: '',
    goal: '',
    durationInDays: 30,
    minContribution: '0.01',
    maxContribution: '10',
    category: 'ai-model'
  });

  const [contributeForm, setContributeForm] = useState({
    campaignId: '',
    amount: ''
  });

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Active</Badge>;
      case 1:
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Successful</Badge>;
      case 2:
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Failed</Badge>;
      case 3:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 0:
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 1:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 2:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 3:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const calculateProgress = (raised: string, goal: string) => {
    const raisedAmount = parseFloat(raised);
    const goalAmount = parseFloat(goal);
    return goalAmount > 0 ? Math.min((raisedAmount / goalAmount) * 100, 100) : 0;
  };

  const isDeadlinePassed = (deadline: number) => {
    return Date.now() / 1000 > deadline;
  };

  const formatDeadline = (deadline: number) => {
    const date = new Date(deadline * 1000);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'Expired';
    } else if (diffDays === 0) {
      return 'Ends today';
    } else if (diffDays === 1) {
      return '1 day left';
    } else {
      return `${diffDays} days left`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Campaign */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Create Crowdfunding Campaign
          </CardTitle>
          <CardDescription>
            Launch a crowdfunding campaign to raise funds for your AI model development
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaignId">Campaign ID</Label>
              <Input
                id="campaignId"
                value={newCampaignForm.campaignId}
                onChange={(e) => setNewCampaignForm(prev => ({ ...prev, campaignId: e.target.value }))}
                placeholder="e.g., quantum-ai-v2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelId">Related Model ID</Label>
              <Input
                id="modelId"
                value={newCampaignForm.modelId}
                onChange={(e) => setNewCampaignForm(prev => ({ ...prev, modelId: e.target.value }))}
                placeholder="e.g., quantum-risk-predictor"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Campaign Title</Label>
            <Input
              id="title"
              value={newCampaignForm.title}
              onChange={(e) => setNewCampaignForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Advanced Quantum Risk Prediction Model"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newCampaignForm.description}
              onChange={(e) => setNewCampaignForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your AI model, its use case, and why people should fund it..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Funding Goal (ETH)</Label>
              <Input
                id="goal"
                type="number"
                step="0.001"
                value={newCampaignForm.goal}
                onChange={(e) => setNewCampaignForm(prev => ({ ...prev, goal: e.target.value }))}
                placeholder="10.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (Days)</Label>
              <Select
                value={newCampaignForm.durationInDays.toString()}
                onValueChange={(value) => setNewCampaignForm(prev => ({ ...prev, durationInDays: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newCampaignForm.category}
                onValueChange={(value) => setNewCampaignForm(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai-model">AI Model</SelectItem>
                  <SelectItem value="trading-bot">Trading Bot</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minContribution">Min Contribution (ETH)</Label>
              <Input
                id="minContribution"
                type="number"
                step="0.001"
                value={newCampaignForm.minContribution}
                onChange={(e) => setNewCampaignForm(prev => ({ ...prev, minContribution: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxContribution">Max Contribution (ETH)</Label>
              <Input
                id="maxContribution"
                type="number"
                step="0.001"
                value={newCampaignForm.maxContribution}
                onChange={(e) => setNewCampaignForm(prev => ({ ...prev, maxContribution: e.target.value }))}
              />
            </div>
          </div>

          <Button 
            onClick={() => onCreateCampaign(newCampaignForm)}
            disabled={loading || !newCampaignForm.campaignId || !newCampaignForm.title || !newCampaignForm.goal}
            className="w-full"
          >
            <Target className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </CardContent>
      </Card>

      {/* My Campaigns */}
      {campaigns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              My Campaigns
            </CardTitle>
            <CardDescription>
              Campaigns you've created and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign, index) => {
                const progress = calculateProgress(campaign.raised, campaign.goal);
                const isExpired = isDeadlinePassed(campaign.deadline);
                const isCreator = campaign.creator.toLowerCase() === userAddress.toLowerCase();

                return (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(campaign.status)}
                          <h3 className="font-semibold">{campaign.title}</h3>
                          {getStatusBadge(campaign.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{campaign.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {campaign.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {campaign.contributorCount} contributors
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDeadline(campaign.deadline)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{parseFloat(campaign.raised).toFixed(4)} / {parseFloat(campaign.goal).toFixed(2)} ETH</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {progress.toFixed(1)}% funded
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {campaign.status === 0 && !isExpired && (
                        <div className="flex gap-2 flex-1">
                          <Input
                            placeholder="Amount (ETH)"
                            value={contributeForm.campaignId === `campaign-${index}` ? contributeForm.amount : ''}
                            onChange={(e) => setContributeForm({ 
                              campaignId: `campaign-${index}`, 
                              amount: e.target.value 
                            })}
                            type="number"
                            step="0.001"
                            className="flex-1"
                          />
                          <Button 
                            size="sm"
                            onClick={() => onContribute(campaign.creator, contributeForm.amount)}
                            disabled={loading || !contributeForm.amount}
                          >
                            <Coins className="h-4 w-4 mr-1" />
                            Contribute
                          </Button>
                        </div>
                      )}

                      {campaign.status === 1 && isCreator && (
                        <Button 
                          size="sm"
                          onClick={() => onWithdrawFunds(campaign.creator)}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          Withdraw Funds
                        </Button>
                      )}

                      {(campaign.status === 2 || (campaign.status === 0 && isExpired)) && !isCreator && (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => onRequestRefund(campaign.creator)}
                          disabled={loading}
                        >
                          Request Refund
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Contributions */}
      {userContributions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-500" />
              My Contributions
            </CardTitle>
            <CardDescription>
              Your contributions to various campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {userContributions.map((contribution, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Coins className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{contribution.campaignId}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(contribution.timestamp * 1000).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {parseFloat(contribution.amount).toFixed(4)} ETH
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}