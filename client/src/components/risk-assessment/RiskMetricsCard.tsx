import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface RiskMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  threshold: number;
  status: 'safe' | 'warning' | 'critical';
  unit: string;
}

interface RiskMetricsCardProps {
  metrics: RiskMetric[];
}

export function RiskMetricsCard({ metrics }: RiskMetricsCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.id} className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {metric.name}
              </CardTitle>
              <Badge 
                variant={metric.status === 'safe' ? 'default' : metric.status === 'warning' ? 'secondary' : 'destructive'}
              >
                {metric.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metric.unit === 'USD' ? `$${metric.value.toLocaleString()}` : metric.value.toFixed(2)}
              {metric.unit && metric.unit !== 'USD' && <span className="text-sm ml-1">{metric.unit}</span>}
            </div>
            <div className={`flex items-center text-sm ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {Math.abs(metric.change).toFixed(1)}%
            </div>
            <Progress 
              value={(metric.value / metric.threshold) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}