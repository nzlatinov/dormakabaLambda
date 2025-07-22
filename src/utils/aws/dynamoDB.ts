import { marshall } from "@aws-sdk/util-dynamodb";
import { region, signaturesTableName } from "../../constants";
import {
    AttributeValue,
    DynamoDBClient,
    PutItemCommand
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region });

export type PersistFunction = typeof putItemToDynamoDb

export const getPersistSignature = (
    persist: PersistFunction,
    tableName: string
) => async (
    commonName: string,
    signedKey: string
) => {
        const keyItem = marshall({
            commonName,
            signedKey,
            timestamp: Date.now()
        })

        try {
            await persist(tableName, keyItem)
        } catch (e) {
            console.log(`Could not persist signature ${e}`)
            throw e
        }
    }

const putItemToDynamoDb = async (TableName: string, Item: Record<string, AttributeValue>) => {

    try {
        const command = new PutItemCommand({ TableName, Item });
        await client.send(command);
    } catch (e) {
        console.log(`Could not write to DB: ${e}`);
        throw e
    }
};

export const persistSignature = getPersistSignature(putItemToDynamoDb, signaturesTableName)

