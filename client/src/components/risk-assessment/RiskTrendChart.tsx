import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ModelPrediction {
  timestamp: string;
  predicted_risk: number;
  actual_risk?: number;
  confidence: number;
  model_version: string;
}

interface RiskTrendChartProps {
  predictions: ModelPrediction[];
  title?: string;
  description?: string;
}

export function RiskTrendChart({ 
  predictions, 
  title = "Risk Trend Analysis", 
  description = "30-day predicted vs actual risk" 
}: RiskTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={predictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="predicted_risk" stroke="#8884d8" name="Predicted Risk" />
            <Line type="monotone" dataKey="actual_risk" stroke="#82ca9d" name="Actual Risk" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}