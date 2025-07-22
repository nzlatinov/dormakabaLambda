import { DeleteItemCommand, DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { handler } from ".";
import { region, RESPONSE_OK, signaturesTableName } from "./constants";
import { marshall } from "@aws-sdk/util-dynamodb";

jest
    .useFakeTimers()
    .setSystemTime(new Date());

const dynamoClient = new DynamoDBClient({ region });

describe('Lambda Integration Test', () => {
    it('should write signature to DB and return "OK" 200 response for happy path', async () => {
        const now = Date.now()

        // Write signature to DB
        const response = await handler({
            queryStringParameters: {
                bucket: 'dormakaba-test-nikola',
                key: 'cert.pem'
            }
        })

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(RESPONSE_OK.body);

        // Get new signature from DB
        const getCommand = new GetItemCommand({
            TableName: signaturesTableName,
            Key: marshall({
                commonName: 'localhost',
                timestamp: now,
            }),
        })
        const { Item } = await dynamoClient.send(getCommand)

        expect(Item).toHaveProperty('commonName')
        expect(Item).toHaveProperty('signedKey')
        expect(Item).toHaveProperty('timestamp')

        // Delete testing entry from DB
        const deleteCommand = new DeleteItemCommand({
            TableName: signaturesTableName,
            Key: marshall({
                commonName: 'localhost',
                timestamp: now,
            }),
        })
        const deleteResponse = await dynamoClient.send(deleteCommand)
        expect(deleteResponse.$metadata.httpStatusCode).toBe(200)

        // Check if it was deleted for real
        const { Item: deletedItem } = await dynamoClient.send(getCommand)

        expect(deletedItem).not.toBeDefined()


    });
});
