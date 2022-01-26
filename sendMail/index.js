const AWS = require('aws-sdk');
exports.handler = async (event) => {
    const sqs = new AWS.SQS({region: 'us-east-1'});
    const S3 = new AWS.S3();
    let content = [];
    const options = {
         Bucket: 'newsletter-subscribe',
         Key: 'users.json',
    };
    try {
        const params = {
            QueueUrl: 'https://sqs.us-east-1.amazonaws.com/310796145073/message'
        };
        const response = {
            statusCode: 200,
            body: JSON.stringify('Success!')
            };
        const message = await sqs.receiveMessage(params).promise();
        if (message) {
            const data = await S3.getObject(options).promise();
            if (data) {
                content = JSON.parse(data.Body.toString('utf-8'));
                for(const item of content) {
                    //send eamil
                }
            }
            response.body = JSON.stringify({message : message.Messages});
        
        } else {
            response.body = JSON.stringify('There are no messages!');
        }
        return response;
    } catch (error) {
        const fail = {
        statusCode: 409,
        body: JSON.stringify({error}),
    };
    return fail
    }
};