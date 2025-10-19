import json
import boto3
import os

s3 = boto3.client('s3')

def lambda_handler(event, context):
    try:
        filename = event['queryStringParameters']['filename']
        bucket = os.environ.get('BUCKET_NAME', 'ai-notes-generator-uploads')
        url = s3.generate_presigned_url(
            ClientMethod='put_object',
            Params={
                'Bucket': bucket,
                'Key': filename,
                'ContentType': 'audio/mpeg'
            },
            ExpiresIn=3600
        )
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  # Or your frontend URL
            },
            'body': json.dumps({'url': url})
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
