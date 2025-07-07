import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FeatureImportance {
  feature: string;
  importance: number;
  description: string;
}

interface FeatureImportanceChartProps {
  features: FeatureImportance[];
  title?: string;
  description?: string;
}

export function FeatureImportanceChart({ 
  features, 
  title = "Feature Importance", 
  description = "Model decision factors" 
}: FeatureImportanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={features} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="feature" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="importance" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}