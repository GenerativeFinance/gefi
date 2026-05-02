import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as awsGetSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommandInput } from "@aws-sdk/client-s3";

const REGION = process.env.AWS_REGION || "us-east-1";
const BUCKET = process.env.S3_BUCKET || "";

const s3Client = new S3Client({
  region: REGION,
  credentials: process.env.AWS_ACCESS_KEY_ID
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }
    : undefined,
});

export async function uploadBufferToS3(key: string, buffer: Buffer, contentType = "application/pdf") {
  if (!BUCKET) throw new Error("S3_BUCKET is not configured");

  const params: PutObjectCommandInput = {
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: "private",
  };

  await s3Client.send(new PutObjectCommand(params));
  return { bucket: BUCKET, key };
}

export async function getSignedUrlForKey(key: string, expiresIn = 900) {
  if (!BUCKET) throw new Error("S3_BUCKET is not configured");
  const getCmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return awsGetSignedUrl(s3Client, getCmd, { expiresIn });
}

export function isS3Configured() {
  return !!(BUCKET && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
}