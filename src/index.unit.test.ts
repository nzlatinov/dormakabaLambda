
import { getHandlerFunction } from ".";
import {
    RESPONSE_BAD_REQUEST,
    RESPONSE_OK,
    RESPONSE_SERVER_ERROR,
    RESPONSE_UNPROCESSABLE_ENTITY
} from "./constants";
import { certificateFixture, privateKeySecretFixture } from "./fixtures";
import { IEvent, IResponse } from "./types.ts";

export const getAWSMock = () => ({
    s3: {
        readFile: jest.fn(),
    },
    dynamoDb: {
        putItem: jest.fn()
    },
    secrets: {
        getSecret: jest.fn(),
    }
} as any)

describe('The handler function ', () => {
    let logSpy: jest.SpyInstance;
    let errorSpy: jest.SpyInstance;

    beforeAll(() => {
        logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    })

    afterAll(() => {
        logSpy.mockRestore();
        errorSpy.mockRestore();
    })

    it.each`
        event                                                   | condition
        ${{ queryStringParameters: {} }}                        | ${'both params missing'}
        ${{ queryStringParameters: { bucket: 'some value' } }}  | ${'key missing'}
        ${{ queryStringParameters: { key: 'some value' } }}     | ${'bucket missing'}
      `('should return "Bad Request" for $condition ', async ({ event }: { event: IEvent }) => {
        const handlerFunction = getHandlerFunction(getAWSMock())

        const result: IResponse = await handlerFunction(event)

        expect(result.statusCode).toBe(RESPONSE_BAD_REQUEST.statusCode);
        expect(result.body).toEqual(RESPONSE_BAD_REQUEST.body);
    })

    it('should return "Bad Request" if certificate could not be fetched', async () => {
        const aws = getAWSMock()
        aws.s3.readFile.mockImplementation(async () => { throw new Error('bad bucket given') })

        const handlerFunction = getHandlerFunction(aws)
        const event = { queryStringParameters: { bucket: 'some bucket', key: 'some key' } }

        const result: IResponse = await handlerFunction(event)

        expect(result.statusCode).toBe(RESPONSE_BAD_REQUEST.statusCode);
        expect(result.body).toEqual(RESPONSE_BAD_REQUEST.body);
    })

    it('should return "Unprocessable Entity" when the certificate is in bad format', async () => {
        const aws = getAWSMock()
        aws.s3.readFile.mockReturnValue(`-----BEGIN CERTIFICATE-----
        MIIDpzCCAo8CFD2nHNhR6Ss/nK2f7J33AuVEhRqhMA0GCSqGSIb3DQEBCwUAMIGP
        -----END CERTIFICATE-----`)

        const handlerFunction = getHandlerFunction(aws)
        const event = { queryStringParameters: { bucket: 'some bucket', key: 'some key' } }

        const result: IResponse = await handlerFunction(event)

        expect(result.statusCode).toBe(RESPONSE_UNPROCESSABLE_ENTITY.statusCode);
        expect(result.body).toEqual(RESPONSE_UNPROCESSABLE_ENTITY.body);
    })

    it('should return "Internal Server Error" when not able to fetch own private key', async () => {
        const aws = getAWSMock()
        aws.s3.readFile.mockReturnValue(certificateFixture)
        aws.secrets.getSecret.mockRejectedValue('could not get secret')

        const handlerFunction = getHandlerFunction(aws)
        const event = { queryStringParameters: { bucket: 'some bucket', key: 'some key' } }

        const result: IResponse = await handlerFunction(event)

        expect(result.statusCode).toBe(RESPONSE_SERVER_ERROR.statusCode);
        expect(result.body).toEqual(RESPONSE_SERVER_ERROR.body);
    })

    it('should return "Internal Server Error" when the key was fetched, but is corrupted', async () => {
        const aws = getAWSMock()
        aws.s3.readFile.mockReturnValue(certificateFixture)
        aws.secrets.getSecret.mockReturnValue('not a real key')

        const handlerFunction = getHandlerFunction(aws)
        const event = { queryStringParameters: { bucket: 'some bucket', key: 'some key' } }

        const result: IResponse = await handlerFunction(event)

        expect(result.statusCode).toBe(RESPONSE_SERVER_ERROR.statusCode);
        expect(result.body).toEqual(RESPONSE_SERVER_ERROR.body);
    })

    it('should return "Internal Server Error" not able to write to DB', async () => {
        const aws = getAWSMock()
        aws.s3.readFile.mockReturnValue(certificateFixture)
        aws.secrets.getSecret.mockReturnValue(privateKeySecretFixture)
        aws.dynamoDb.putItem.mockRejectedValue('could not write to DB')

        const handlerFunction = getHandlerFunction(aws)
        const event = { queryStringParameters: { bucket: 'some bucket', key: 'some key' } }

        const result: IResponse = await handlerFunction(event)

        expect(result.statusCode).toBe(RESPONSE_SERVER_ERROR.statusCode);
        expect(result.body).toEqual(RESPONSE_SERVER_ERROR.body);
    })

    it('should return response "OK" when all is good', async () => {
        const aws = getAWSMock()
        aws.s3.readFile.mockReturnValue(certificateFixture)
        aws.secrets.getSecret.mockReturnValue({ privateKeyDKaba: privateKeySecretFixture })
        aws.dynamoDb.putItem.mockImplementation(() => { })

        const handlerFunction = getHandlerFunction(aws)
        const event = { queryStringParameters: { bucket: 'some bucket', key: 'some key' } }
        const result: IResponse = await handlerFunction(event)

        expect(result.statusCode).toBe(RESPONSE_OK.statusCode);
        expect(result.body).toEqual(RESPONSE_OK.body);
    })
})
