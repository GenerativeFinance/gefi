-- Add reports table for PDF report generation system
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  type VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending',
  pdf_url VARCHAR,
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  metadata JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE reports IS 'Stores PDF report generation requests and metadata';
COMMENT ON COLUMN reports.type IS 'Type of report: portfolio_performance, risk_assessment, market_analysis, compliance, allocation';
COMMENT ON COLUMN reports.status IS 'Report status: pending, rendering, completed, failed';
COMMENT ON COLUMN reports.pdf_url IS 'URL path to the generated PDF file';
COMMENT ON COLUMN reports.error IS 'Error message if report generation failed';
COMMENT ON COLUMN reports.metadata IS 'Additional report configuration and data';