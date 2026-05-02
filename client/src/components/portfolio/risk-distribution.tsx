import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RiskDistributionProps {
  assets: any[];
}

export default function RiskDistribution({ assets }: RiskDistributionProps) {
  // Default risk distribution if no assets data
  const defaultDistribution = [
    { name: "Stocks", allocation: 60, color: "from-primary to-blue-500" },
    { name: "Bonds", allocation: 30, color: "from-blue-500 to-purple-500" },
    { name: "Crypto", allocation: 10, color: "from-purple-500 to-pink-500" },
  ];

  const distribution = assets && assets.length > 0 
    ? assets.map(asset => ({
        name: asset.assetType.charAt(0).toUpperCase() + asset.assetType.slice(1),
        allocation: parseFloat(asset.allocation),
        color: getColorForAssetType(asset.assetType)
      }))
    : defaultDistribution;

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Risk Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {distribution.map((asset, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{asset.name}</span>
                <span className="text-sm font-semibold">{asset.allocation}%</span>
              </div>
              <Progress value={asset.allocation} className="h-2" />
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Risk Level</span>
            <span className="text-yellow-400 font-semibold">Moderate</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getColorForAssetType(assetType: string) {
  switch ((assetType ?? '').toLowerCase()) {
    case 'stocks':
      return 'from-primary to-blue-500';
    case 'bonds':
      return 'from-blue-500 to-purple-500';
    case 'crypto':
      return 'from-purple-500 to-pink-500';
    default:
      return 'from-gray-500 to-gray-600';
  }
}
