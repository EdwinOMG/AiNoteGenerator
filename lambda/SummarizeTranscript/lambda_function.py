import json
import boto3
from openai import OpenAI  # added as a layer to the lambda function
import os

s3 = boto3.client('s3')
secrets_client = boto3.client('secretsmanager')

def get_openai_key(secret_name):
    response = secrets_client.get_secret_value(SecretId=secret_name)
    secret = json.loads(response['SecretString'])
    return secret['OPENAI_API_KEY']

def lambda_handler(event, context):
    try:
        # Extract bucket and key from event (transcripts bucket)
        bucket = event['Records'][0]['s3']['bucket']['name']
        key = event['Records'][0]['s3']['object']['key']

        # Load the transcript JSON from the transcripts bucket
        transcript_obj = s3.get_object(Bucket=bucket, Key=key)
        transcript_json = json.loads(transcript_obj['Body'].read())
        transcript_text = transcript_json['results']['transcripts'][0]['transcript']

        # Get OpenAI API key
        secret_name = 'gptKey'
        OpenAI.api_key = get_openai_key(secret_name)

        prompt = f"Summarize this lecture transcript into study notes for a student to understand clearly and easily. If the language is inappropriate, use similar word to replace the inappropriate words.:\n\n{transcript_text}"
        
        client = OpenAI(api_key=get_openai_key(secret_name))

        # Call OpenAI ChatCompletion
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes transcripts into easy-to-understand study notes."},
                {"role": "user", "content": prompt}
            ]
        )

        summary = response.choices[0].message.content.strip()

        # Define the bucket for summaries (different from transcripts bucket)
        summaries_bucket = os.environ['SUMMARIES_BUCKET']  # e.g. ai-notes-generator-summaries

        # Build the summary key path (e.g., same folder structure but in summaries bucket)
        summary_key = key.replace('transcripts/', '').replace('.json', '-summary.txt')
        summary_key = f"summaries/{summary_key}"

        # Upload summary to the summaries bucket
        s3.put_object(
            Bucket=summaries_bucket,
            Key=summary_key,
            Body=summary.encode('utf-8'),
            ContentType='text/plain'
        )

        return {
            'statusCode': 200,
            'body': json.dumps('Summary created successfully!')
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error: {str(e)}")
        }
