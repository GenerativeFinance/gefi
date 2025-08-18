import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// S3 Configuration from environment variables
const S3_BUCKET = process.env.S3_BUCKET || 'gefi-reports-dev';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

// Create S3 client with proper configuration
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  } : undefined, // Use default credential chain if not provided
});

/**
 * Upload a buffer to S3
 * @param bucket S3 bucket name
 * @param key S3 object key (path/filename)
 * @param buffer File buffer to upload
 * @param contentType MIME type of the file
 * @returns Promise with upload result
 */
export async function uploadBuffer(
  bucket: string,
  key: string,
  buffer: Buffer,
  contentType: string = 'application/pdf'
): Promise<{ success: boolean; error?: string; s3Key?: string }> {
  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: {
        uploadedAt: new Date().toISOString(),
        service: 'gefi-reports'
      }
    });

    await s3Client.send(command);
    
    return { success: true, s3Key: key };
  } catch (error) {
    console.error('S3 upload failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown S3 upload error' 
    };
  }
}

/**
 * Generate a presigned URL for downloading an S3 object
 * @param key S3 object key
 * @param expiresSeconds URL expiration time in seconds (default: 15 minutes)
 * @returns Promise with signed URL
 */
export async function getSignedDownloadUrl(
  key: string,
  expiresSeconds: number = 900 // 15 minutes
): Promise<{ success: boolean; signedUrl?: string; error?: string }> {
  try {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: expiresSeconds 
    });

    return { success: true, signedUrl };
  } catch (error) {
    console.error('Failed to generate signed URL:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown signed URL error' 
    };
  }
}

/**
 * Upload a PDF buffer to S3 with a generated key
 * @param reportId Unique report identifier
 * @param pdfBuffer PDF file buffer
 * @returns Promise with upload result and signed URL
 */
export async function uploadReportPDF(
  reportId: string,
  pdfBuffer: Buffer
): Promise<{ 
  success: boolean; 
  s3Key?: string; 
  signedUrl?: string; 
  error?: string; 
}> {
  const s3Key = `reports/${new Date().getFullYear()}/${reportId}.pdf`;
  
  const uploadResult = await uploadBuffer(S3_BUCKET, s3Key, pdfBuffer, 'application/pdf');
  
  if (!uploadResult.success) {
    return uploadResult;
  }

  // Generate signed URL for download
  const urlResult = await getSignedDownloadUrl(s3Key);
  
  return {
    success: uploadResult.success && urlResult.success,
    s3Key,
    signedUrl: urlResult.signedUrl,
    error: urlResult.error
  };
}

export { S3_BUCKET, AWS_REGION };