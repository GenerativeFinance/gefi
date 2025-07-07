export interface RiskMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  threshold: number;
  status: 'safe' | 'warning' | 'critical';
  unit: string;
}

export interface ModelPrediction {
  timestamp: string;
  predicted_risk: number;
  actual_risk?: number;
  confidence: number;
  model_version: string;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  description: string;
}

export interface RiskAssessmentParameters {
  confidence_level: number;
  time_horizon: number;
  portfolio_value: number;
  stress_scenario: string;
}

export interface PredictionResult {
  model_id: string;
  parameters: RiskAssessmentParameters;
  result: {
    predicted_risk: number;
    confidence: number;
    risk_factors: Array<{
      factor: string;
      contribution: number;
    }>;
    recommendations: string[];
  };
  timestamp: string;
}

export interface UploadResult {
  file_id: string;
  filename: string;
  size: number;
  rows: number;
  columns: number;
  status: 'processing' | 'processed' | 'failed';
  quality_score: number;
  timestamp: string;
}

export interface RiskAlert {
  id: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  message: string;
  timestamp: string;
  metric_id?: string;
  threshold_breached?: boolean;
}

export interface SystemStatus {
  name: string;
  status: 'operational' | 'warning' | 'down';
  uptime: string;
  last_check: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  type: 'comment' | 'annotation';
  position?: { x: number; y: number };
  metric_id?: string;
  chart_id?: string;
}