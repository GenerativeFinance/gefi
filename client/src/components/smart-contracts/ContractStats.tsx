import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, DollarSign, Activity, RefreshCw, ArrowUpRight } from 'lucide-react';

interface ContractStatsProps {
  platformStats: {
    totalCampaigns: number;
    totalRaised: string;
    platformFee: number;
  };
  pendingWithdrawal: string;
  userContributions: any[];
  campaigns: any[];
  onRefresh: () => void;
  onWithdraw: () => void;
  loading: boolean;
}

export default function ContractStats({
  platformStats,
  pendingWithdrawal,
  userContributions,
  campaigns,
  onRefresh,
  onWithdraw,
  loading
}: ContractStatsProps) {
  const totalUserContributed = userContributions.reduce((sum, contrib) => sum + parseFloat(contrib.amount), 0);
  const activeCampaigns = campaigns.filter(c => c.status === 0).length;
  const successfulCampaigns = campaigns.filter(c => c.status === 1).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Platform Stats */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Platform Stats</CardTitle>
          <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {platformStats.totalCampaigns}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Total Campaigns • {platformStats.totalRaised} ETH Raised
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {platformStats.platformFee}% Fee
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Pending Withdrawal */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Pending Withdrawal</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {parseFloat(pendingWithdrawal).toFixed(4)} ETH
          </div>
          <p className="text-xs text-green-600 dark:text-green-400">
            Available for withdrawal
          </p>
          <Button
            size="sm"
            onClick={onWithdraw}
            disabled={parseFloat(pendingWithdrawal) === 0 || loading}
            className="mt-2 w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <ArrowUpRight className="h-3 w-3 mr-1" />}
            Withdraw
          </Button>
        </CardContent>
      </Card>

      {/* User Contributions */}
      <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">My Contributions</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {totalUserContributed.toFixed(4)} ETH
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400">
            Across {userContributions.length} contributions
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {userContributions.length} Campaigns
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* My Campaigns */}
      <Card className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">My Campaigns</CardTitle>
          <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
            {campaigns.length}
          </div>
          <p className="text-xs text-orange-600 dark:text-orange-400">
            {activeCampaigns} Active • {successfulCampaigns} Successful
          </p>
          <div className="flex items-center space-x-1 mt-2">
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              {successfulCampaigns} Success
            </Badge>
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
              {activeCampaigns} Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}