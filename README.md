🎧 AI Notes Generator

By Edwin Morales Jr | Software Engineer

An AI-powered study notes generator built on AWS serverless architecture. Upload an audio file (.mp3) and the system automatically transcribes it with Amazon Transcribe, then summarizes it using OpenAI GPT into concise study notes.

🚀 Features

Fully Automated Workflow: Upload → Transcribe → Summarize → Store

Frontend-Backend Integration:

API Gateway + Lambda handle presigned URL generation and communicate with the frontend.

Frontend can securely upload files and fetch summaries without direct AWS credentials.

Serverless & Scalable: AWS Lambda, S3, Transcribe

Cloud-Native: No servers to manage, fully event-driven

Versatile: Ideal for lectures, podcasts, or meetings

Frontend (Vue.js)
        │
        ▼
API Gateway + Lambda (API for uploads & presigned URLs)
        │
        ▼
uploads/ (S3 Bucket)
        │
        ▼
Lambda #1: Transcription Trigger
        │
        ▼
transcripts/ (S3 Bucket)
        │
        ▼
Lambda #2: Summarization Trigger
        │
        ▼
summaries/ (S3 Bucket)

🧠 Tech Stack

Frontend: Vue.js + Axios

Backend/API: AWS Lambda + API Gateway

Storage & Triggers: AWS S3

Transcription: Amazon Transcribe

AI Summarization: OpenAI GPT

Language & SDK: Python + Boto3

✅ Summary
A serverless, AI-powered tool that converts audio into structured notes, integrating frontend, API Gateway, Lambda functions, S3, and AI services — fully cloud-native and scalable.

Not officialy deploying due to AWS and OpenAI cost (Too poor to be going in debt for a project lmao)
