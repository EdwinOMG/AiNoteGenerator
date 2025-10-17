

🎧 AI Notes Generator  
By Edwin Morales Jr | Software Engineer

An automated AI-powered study notes generator built entirely on AWS Cloud Services. This system listens for audio file uploads, transcribes them using Amazon Transcribe, and summarizes the transcriptions into concise study notes using OpenAI, all orchestrated through AWS Lambda and S3 triggers.

⸻

🚀 Features
	•	Automatic Workflow
	•	Upload an audio file (.mp3) to the uploads S3 bucket.
	•	The system automatically:
	1.	Transcribes the audio using Amazon Transcribe.
	2.	Stores the transcription in the transcripts bucket.
	3.	Generates summarized study notes using OpenAI GPT.
	4.	Saves the summary to the summaries bucket.
	•	Serverless Architecture
	•	100% cloud-native using AWS Lambda, S3, and AWS Transcribe.
	•	No servers to manage — fully event-driven.
	•	Scalable and Modular
	•	Easily extendable with additional processing stages.
	•	Designed for academic, podcast, or meeting note automation.

🧱 Architecture Overview

  ┌───────────────┐
  │   uploads/    │
  │   (S3 Bucket) │
  └──────┬────────┘
         │
         ▼
  [Lambda #1: Transcription Trigger]
         │
         ▼
  ┌───────────────┐
  │ transcripts/  │
  │  (S3 Bucket)  │
  └──────┬────────┘
         │
         ▼     
 [Lambda #2: Summarization Trigger]
         │
         ▼
  ┌───────────────┐
  │ summaries/    │
  │  (S3 Bucket)  │
  └───────────────┘      

  🧠 Technologies Used
	•	AWS S3 – File storage and event triggers
	•	AWS Lambda – Serverless compute for workflow automation
	•	AWS Transcribe – Audio-to-text transcription service
	•	OpenAI API – Summarization and note generation
	•	Python – Lambda function code
	•	Boto3 – AWS SDK for Python

  💡 Future Improvements
	•	Add a frontend web dashboard to:
	•	Upload audio files directly.
	•	View transcripts and summaries.
	•	Add authentication (via AWS Cognito).
