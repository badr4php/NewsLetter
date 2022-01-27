const AWS = require('aws-sdk');
exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const sqs = new AWS.SQS();
    const params = {
            MessageAttributes: {
                "Subject": {
                    DataType: "String",
                    StringValue: body.subject
                }
            },
            MessageBody: body.text,
            QueueUrl: "https://sqs.us-east-1.amazonaws.com/310796145073/lambada-message"
        };
    try {
            const data = await sqs.sendMessage(params).promise();
            const response = {
                statusCode: 200,
                body: JSON.stringify({data}),
            };
            return response;
    } catch (error) {
        const response = {
            statusCode: 409,
            body: JSON.stringify({error}),
        };
        return response;
    }
};