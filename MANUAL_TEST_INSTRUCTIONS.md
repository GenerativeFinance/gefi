# Manual Test Instructions for Report Generation

## Prerequisites
- Redis server running (for BullMQ queue)
- AWS S3 credentials configured (optional - will fallback to local storage)
- Server running with `npm run dev`

## Test Steps

### 1. Test Report Generation Endpoint

```bash
# Generate a report
curl -X POST http://localhost:5173/api/reports/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "monthly-performance",
    "title": "Test Monthly Report",
    "data": {
      "user": {
        "firstName": "Test",
        "lastName": "User",
        "email": "test@example.com"
      }
    }
  }'
```

Expected response:
```json
{
  "reportId": "uuid-string",
  "statusUrl": "/api/reports/uuid-string/status",
  "message": "Report generation job enqueued successfully"
}
```

### 2. Test Status Polling

```bash
# Check report status (replace with actual reportId)
curl http://localhost:5173/api/reports/{reportId}/status
```

Expected responses:
- Pending: `{"reportId": "...", "status": "pending"}`
- Processing: `{"reportId": "...", "status": "processing", "progress": 50}`
- Completed: `{"reportId": "...", "status": "completed", "downloadUrl": "/api/reports/.../download"}`
- Failed: `{"reportId": "...", "status": "failed", "error": "error message"}`

### 3. Test Download

```bash
# Download completed report (replace with actual reportId)
curl http://localhost:5173/api/reports/{reportId}/download -o test-report.pdf
```

Expected: PDF file downloaded or signed S3 URL redirect

## UI Testing

1. Navigate to `/investor/reports` in the browser
2. Click on any "Download" button for existing reports
3. Observe the toast notifications showing progress
4. Verify PDF download starts automatically when complete

## Error Scenarios

### Missing Required Fields
```bash
curl -X POST http://localhost:5173/api/reports/generate \
  -H "Content-Type: application/json" \
  -d '{"data": {}}'
```
Expected: 400 error with "Report name and type are required"

### Template Safety Test
Test that missing user.profileImageUrl doesn't crash the system:
```bash
curl -X POST http://localhost:5173/api/reports/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "monthly-performance",
    "title": "Safety Test Report",
    "data": {}
  }'
```
Should complete without errors despite missing user data.

## Monitoring

- Check server logs for worker activity
- Verify files are created in `/tmp/` or uploaded to S3
- Check metadata files in `storage/reports/metadata/`

## Production Configuration

Set these environment variables for production:
```
REDIS_URL=redis://your-redis-server:6379
S3_BUCKET=your-production-bucket
AWS_REGION=your-aws-region
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```