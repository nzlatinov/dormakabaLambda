import { getDynamoDBService } from "./dynamoDB";
import { createSignedKeyEntry } from "../../models/signedKey";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

describe('The dynamoDBService', () => {
    describe('putItem', () => {

        it('should persist signature to db', async () => {
            const entry = createSignedKeyEntry('localhost', 'signedKeyValue')
            const clientMock = {
                send: jest.fn()
            } as unknown as DynamoDBClient
            const putItem = getDynamoDBService(clientMock).putItem

            await putItem('nice', entry)

            expect(clientMock.send).toHaveBeenCalledTimes(1)
        })

        it('should persists data in correct format', async () => {
            const entry = createSignedKeyEntry('localhost', 'signedKeyValue')
            const clientMock = {
                send: jest.fn()
            } as any
            const putItem = getDynamoDBService(clientMock).putItem
            await putItem('nice', entry)

            const input = await clientMock.send.mock.calls[0][0].input

            expect(input.TableName).toBe('nice')
            expect(input.Item.commonName.S).toBe('localhost')
            expect(input.Item.signedKey.S).toBe('signedKeyValue')
            expect(input.Item.timestamp.N).not.toBeNaN()
        })

        it('should throw an error if not able to persist', async () => {
            const entry = createSignedKeyEntry('localhost', 'signedKeyValue')
            const clientMock = {
                send: () => { throw new Error() }
            } as unknown as DynamoDBClient
            const putItem = getDynamoDBService(clientMock).putItem

            const invoke = () => putItem('nice', entry)

            await expect(invoke).rejects.toThrow()
        })
    })
})
