import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
const config = {
    region: process.env.AWS_REGION
}
const corsHeaders = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST"
}

if (process.env.DB_URL) {
    config.endpoint = process.env.DB_URL;
}
var client = null
client = new DynamoDBClient(config);

export const cors = async (_) => {
    const response = {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
}
export const index = async (event) => {
    const { email, source } = JSON.parse(event.body);  // Expecting a JSON payload with email and name
    if (email == null) {
        return {
            statusCode: 422,
            headers: corsHeaders,
            body: JSON.stringify({
                message: 'Email not defined',
            }),
        };
    }
    if (source == null) {
        return {
            statusCode: 422,
            headers: corsHeaders,
            body: JSON.stringify({
                message: 'Source not defined',
            }),
        };
    }

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
            headers: corsHeaders,
            body: JSON.stringify({
                message: 'User data saved successfully!',
                email: email,
                source: source,
            }),
        };

    } catch (error) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                message: error.message,
            }),
        };
    }
};
