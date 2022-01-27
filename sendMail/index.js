const AWS = require('aws-sdk');
exports.handler = async (event) => {
    const S3 = new AWS.S3();
    const ses = new AWS.SES();
    let content = [];
    const options = {
         Bucket: 'newsletter-subscribe',
         Key: 'users.json',
    };
    const messageOptions = {
            Bucket: 'newsletter-subscribe',
            Key: 'message.csv',
            ContentType: 'text/plain'
    };
    try {
            const data = await S3.getObject(options).promise();
            if (data) {
                content = JSON.parse(data.Body.toString('utf-8'));
                const bodyContent = [];
                const emails = [];
                for(const item of content) {
                    emails.push(item.email);
                }
                event.Records.forEach(record => {
                    bodyContent.push(record.body);
                    const sesParams = {
                        Destination: {
                            ToAddresses: emails,
                        },
                        Message: {
                            Body: {
                                Text: { Data: record.body },
                            },

                            Subject: { Data: record.messageAttributes.Subject.stringValue },
                        },
                        Source: "mohamed.mahmoud@camelcasetech.com",
                    };
 
                    const sesResponse =  ses.sendEmail(sesParams).promise()
                });
                const s3Response = await S3.upload({...messageOptions, Body: JSON.stringify({bodyContent, emails})}).promise();
                
                console.log(JSON.stringify({message : bodyContent}));
            }
        
    } catch (error) {
        console.log(error);
    }
};
