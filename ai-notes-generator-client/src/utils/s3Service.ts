// src/services/s3Service.ts
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import axios from 'axios'

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  }
})

export async function getSummaries() {
  const response = await s3.send(new ListObjectsV2Command({
    Bucket: import.meta.env.VITE_S3_BUCKET_SUMMARIES
  }))
  return response.Contents?.map(item => item.Key) || []
}

export async function getPresignedUrl(filename: string) {
  const { data } = await axios.get(import.meta.env.VITE_API_GATEWAY_URL, {
    params: { filename }
  })
  return data.url
}

export async function uploadToS3(url: string, file: File) {
  await axios.put(url, file, { headers: { 'Content-Type': file.type } })
}