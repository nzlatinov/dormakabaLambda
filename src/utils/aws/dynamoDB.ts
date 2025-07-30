import {
    AttributeValue,
    DynamoDBClient,
    PutItemCommand
} from "@aws-sdk/client-dynamodb";

export interface DynamoDBService {
    putItem: (TableName: string, Item: Record<string, AttributeValue>) => Promise<void>
}

export const getDynamoDBService = (client: DynamoDBClient) => ({
    putItem: getPutItem(client)
})

const getPutItem = (client: DynamoDBClient) =>
    async (TableName: string, Item: Record<string, AttributeValue>): Promise<void> => {

        try {
            const command = new PutItemCommand({ TableName, Item });
            await client.send(command);
        } catch (e) {
            console.log(`Could not write to DB: ${e}`);
            throw e
        }
    };
