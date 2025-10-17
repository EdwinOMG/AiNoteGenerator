# AWS AI Notes Generator

This project automatically creates study notes from uploaded MP3 files using AWS services.

### Workflow
1. **Upload Stage:** MP3 files uploaded to the `uploads` S3 bucket trigger the Transcribe Lambda.
2. **Transcription Stage:** AWS Transcribe converts audio to text and saves it to the `transcripts` bucket.
3. **Summarization Stage:** A second Lambda uses the OpenAI API to summarize transcripts and saves the result to the `summaries` bucket.

### Tech Stack
- AWS S3
- AWS Lambda
- AWS Transcribe
- OpenAI API
- Python

### Future Additions
- Web frontend to upload audio and view summaries
- Secure authentication for user uploads