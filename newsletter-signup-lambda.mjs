import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
var client = null
client = new DynamoDBClient({ region: "eu-central-1" });

export const newsletterSignupLambdaHandler = async (event) => {
    const { email, source } = JSON.parse(event.body);  // Expecting a JSON payload with email and name

    const params = {
        Item: {
            Email: {
                S: email
            },
            Source: {
                S: source
            },
            Timestamp: {
                S: Date.now().toString()
            }
        },
        TableName: "NewsletterSignups"
    };
    const command = new PutItemCommand(params);

    try {
        await client.send(command);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'User data saved successfully!',
                email: email,
                source: source,
            }),
        };

    } catch (error) {
        console.log(error);
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: error.message,
                email: email,
                source: source,
            }),
        };
    }
};
