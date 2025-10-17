import boto3
import os
import urllib.parse
import uuid

transcribe = boto3.client('transcribe')

def lambda_handler(event, context):
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'])

    job_name = f"TranscriptionJob-{uuid.uuid4()}"
    file_uri = f"s3://{bucket}/{key}"

    output_bucket = os.environ['TRANSCRIPT_BUCKET']

    transcribe.start_transcription_job(
        TranscriptionJobName=job_name,
        Media={'MediaFileUri': file_uri},
        MediaFormat=key.split('.')[-1],
        LanguageCode='en-US',
        OutputBucketName=output_bucket
    )

    return {
        'statusCode': 200,
        'body': f"Started transcription job: {job_name}"
    }
