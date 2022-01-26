const AWS = require('aws-sdk');

exports.handler = async (event, context, call) => {
    const S3 = new AWS.S3();
    const body = JSON.parse(event.body);
    let content = [];
    const options = {
         Bucket: 'newsletter-subscribe',
         Key: 'users.json',
    };
    try {
        const data = await S3.getObject(options).promise();
        if (data) {
            content = JSON.parse(data.Body.toString('utf-8'));
        }
        const updatedContent = content.filter((item) => {
                return item.email !== body.email
            });
        const params = {
                Bucket: 'newsletter-subscribe',
                Key: 'users.json',
                Body: JSON.stringify(updatedContent),
                ContentType: 'text/plain',
            };
        const s3Response = await S3.upload(params).promise();
        const res = {
            'statusCode': 200,
            'headers': { 'Content-Type': 'application/json' },
            'body': JSON.stringify({s3Path :s3Response.Location, updatedContent})
        }
        
        return res; 

    } catch (error) {
        
        const fail = {
            'statusCode': 409,
            'headers': {'Content-Type': 'application/json'},
            'body': JSON.stringify({error})
        }

        return fail;
    }
};