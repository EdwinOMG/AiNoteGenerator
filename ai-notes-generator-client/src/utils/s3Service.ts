// src/services/s3Service.ts
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3'
import axios from 'axios'

console.log('VITE_API_GATEWAY_URL:', import.meta.env.VITE_API_GATEWAY_URL);
const BUCKET_NAME = "ai-notes-generator-summaries";

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  }
})

export async function getSummaries() {
  const command = new ListObjectsV2Command({ Bucket: BUCKET_NAME });
  const response = await s3.send(command);
  return response.Contents || [];
}


export async function getSummaryContent(key: string): Promise<string> {
  const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
  const response = await s3.send(command);

  // Response.Body is a ReadableStream. We need to convert it to string
  const stream = response.Body as ReadableStream<Uint8Array>;

  const reader = stream.getReader();
  const chunks = [];
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    if (value) chunks.push(value);
    done = doneReading;
  }

  const concatenated = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
  let position = 0;
  for (const chunk of chunks) {
    concatenated.set(chunk, position);
    position += chunk.length;
  }

  return new TextDecoder("utf-8").decode(concatenated);
}
export async function getPresignedUrl(filename: string) {
  try {
    const apiUrl = import.meta.env.VITE_API_GATEWAY_URL;
    if (!apiUrl) {
      throw new Error("VITE_API_GATEWAY_URL is not defined");
    }

    const { data } = await axios.get(apiUrl, {
      params: { filename }
    });

    console.log("Presigned URL response:", data);

    if (!data?.url) {
      throw new Error("Presigned URL not found in response");
    }

    return data.url;
  } catch (error) {
    console.error("Error in getPresignedUrl:", error);
    throw error;
  }
}
export async function uploadToS3(url: string, file: File) {
  await axios.put(url, file, { headers: { 'Content-Type': file.type } })
}