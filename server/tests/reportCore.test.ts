import { describe, test, expect } from '@jest/globals';
import { createReport, getReport, updateReport } from '../models/reportStore';
import { processReportJob } from '../workers/reportGenerator';
import fs from 'fs/promises';
import path from 'path';

// Mock data for testing
const mockReportData = {
  reportId: 'test-report-123',
  userId: 'test-user-456',
  type: 'monthly-performance',
  title: 'Test Monthly Report',
  status: 'pending' as const,
};

describe('Report Store and Processing', () => {
  // Clean up test files after tests
  afterEach(async () => {
    try {
      const storageDir = path.join(__dirname, '..', '..', 'storage', 'reports', 'metadata');
      const testFile = path.join(storageDir, `${mockReportData.reportId}.json`);
      await fs.unlink(testFile);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  });

  test('should create and retrieve report metadata', async () => {
    // Create report
    const created = await createReport(mockReportData);
    expect(created.reportId).toBe(mockReportData.reportId);
    expect(created.status).toBe('pending');
    expect(created.createdAt).toBeDefined();

    // Retrieve report
    const retrieved = await getReport(mockReportData.reportId);
    expect(retrieved).not.toBeNull();
    expect(retrieved!.reportId).toBe(mockReportData.reportId);
    expect(retrieved!.userId).toBe(mockReportData.userId);
  });

  test('should update report metadata', async () => {
    // Create report
    await createReport(mockReportData);

    // Update report
    const updated = await updateReport(mockReportData.reportId, {
      status: 'completed',
      progress: 100,
    });

    expect(updated).not.toBeNull();
    expect(updated!.status).toBe('completed');
    expect(updated!.progress).toBe(100);
    expect(updated!.updatedAt).not.toBe(updated!.createdAt);
  });

  test('should return null for non-existent report', async () => {
    const report = await getReport('non-existent-id');
    expect(report).toBeNull();
  });

  test('should process report job with safe template data', async () => {
    // This test validates that the report processor handles missing user data safely
    const jobPayload = {
      reportId: 'test-job-789',
      templateId: 'executive-report',
      data: {
        // Missing user.profileImageUrl should be handled safely
        reportName: 'Test Safety Report'
      }
    };

    // Mock the file system operations for the template
    const originalReadFile = fs.readFile;
    const mockTemplate = `
      <html>
        <body>
          <h1>{{reportName}}</h1>
          <p>User: {{user.firstName}} {{user.lastName}}</p>
          <img src="{{user.profileImageUrl}}" alt="Profile" />
        </body>
      </html>
    `;

    // Create a mock template file
    const templateDir = path.join(__dirname, '..', 'templates');
    await fs.mkdir(templateDir, { recursive: true });
    const templatePath = path.join(templateDir, 'executive-report.html');
    await fs.writeFile(templatePath, mockTemplate, 'utf8');

    try {
      // This should not throw errors even with missing user data
      const result = await processReportJob(jobPayload);
      
      // Should succeed or fail gracefully, not crash
      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');
      
      if (!result.success) {
        expect(result).toHaveProperty('error');
        expect(typeof result.error).toBe('string');
      }
    } finally {
      // Clean up mock template
      try {
        await fs.unlink(templatePath);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });
});