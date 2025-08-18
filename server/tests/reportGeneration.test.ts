import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { registerReportRoutes } from '../routes/reportRoutes.js';

// Mock auth middleware for testing
const mockAuth = (req: any, res: any, next: any) => {
  req.isAuthenticated = () => true;
  req.user = { id: 'test-user-123' };
  next();
};

describe('Report Generation API', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(mockAuth);
    registerReportRoutes(app);
  });

  test('POST /api/reports/generate should enqueue report generation', async () => {
    const reportRequest = {
      type: 'monthly-performance',
      title: 'Test Monthly Report',
      data: {
        user: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com'
        }
      },
      templateId: 'executive-report'
    };

    const response = await request(app)
      .post('/api/reports/generate')
      .send(reportRequest);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('reportId');
    expect(response.body).toHaveProperty('statusUrl');
    expect(response.body.statusUrl).toMatch(/\/api\/reports\/.*\/status/);
  });

  test('POST /api/reports/generate should fail without required fields', async () => {
    const response = await request(app)
      .post('/api/reports/generate')
      .send({ data: {} }); // Missing type and title

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Report name and type are required');
  });

  test('GET /api/reports/:id/status should return report status', async () => {
    // First, generate a report
    const reportRequest = {
      type: 'risk-compliance', 
      title: 'Test Risk Report',
      data: {}
    };

    const generateResponse = await request(app)
      .post('/api/reports/generate')
      .send(reportRequest);

    expect(generateResponse.status).toBe(200);
    const { reportId } = generateResponse.body;

    // Then check its status
    const statusResponse = await request(app)
      .get(`/api/reports/${reportId}/status`);

    expect(statusResponse.status).toBe(200);
    expect(statusResponse.body).toHaveProperty('reportId', reportId);
    expect(statusResponse.body).toHaveProperty('status');
    expect(['pending', 'processing', 'completed', 'failed']).toContain(statusResponse.body.status);
  });

  test('GET /api/reports/:id/download should handle not ready reports', async () => {
    // Generate a report
    const reportRequest = {
      type: 'portfolio-optimization',
      title: 'Test Portfolio Report', 
      data: {}
    };

    const generateResponse = await request(app)
      .post('/api/reports/generate')
      .send(reportRequest);

    const { reportId } = generateResponse.body;

    // Try to download immediately (should not be ready)
    const downloadResponse = await request(app)
      .get(`/api/reports/${reportId}/download`);

    // Should return 202 (not ready) or 404 (not found)
    expect([202, 404]).toContain(downloadResponse.status);
  });

  test('GET /api/reports/invalid-id/status should return 404', async () => {
    const response = await request(app)
      .get('/api/reports/invalid-report-id/status');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
});