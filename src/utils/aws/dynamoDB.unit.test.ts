import { getPersistSignature, PersistFunction } from "./dynamoDB";
import { AttributeValue } from "@aws-sdk/client-dynamodb";


const dbMock: { [key: string]: any[] } = {
    nice: []
}

const putItemToDynamoDbMock: PersistFunction = async (TableName: string, Item: Record<string, AttributeValue>) => {
    if (TableName !== 'nice') {

        throw new Error('could not write to DB')
    }

    dbMock[TableName].push(Item)
}


describe('The getPersistSignature function creates function that ', () => {
    it('should persists signature to db', async () => {
        const persistSignature = getPersistSignature(putItemToDynamoDbMock, 'nice')
        const length = dbMock.nice.length

        await persistSignature('localhost', 'signedKeyValue')

        expect(dbMock['nice'].length).toBe(length + 1)
    })

    it('should persists data in correct format', async () => {
        const persistSignature = getPersistSignature(putItemToDynamoDbMock, 'nice')
        const length = dbMock.nice.length
        const expected = {
            commonName: { S: 'localhost' },
            signedKey: { S: 'signedKeyValue' },
        }

        await persistSignature('localhost', 'signedKeyValue')

        expect(dbMock['nice'][length]).toMatchObject(expected)
        expect(Number(dbMock['nice'][length].timestamp.N)).not.toBeNaN()
    })

    it('should throw an error if not able to persist', async () => {
        const persistSignature = getPersistSignature(putItemToDynamoDbMock, 'badTableName')

        const invoke = () => persistSignature('localhost', 'signedKeyValue')

        await expect(invoke).rejects.toThrow()
    })
})
