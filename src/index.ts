import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { S3Client } from "@aws-sdk/client-s3";
import {
    RESPONSE_OK,
    RESPONSE_BAD_REQUEST,
    RESPONSE_SERVER_ERROR,
    RESPONSE_UNPROCESSABLE_ENTITY,
    signaturesTableName,
    region,
    privateKeyId,
} from "./constants"
import { IEvent, IResponse } from "./types.ts";
import { extractCertificate } from "./utils/crypto/extract"
import { sign } from "./utils/crypto/sign"
import { IAWSService } from "./utils/aws/aws.service.types";
import { createSignedKeyEntry } from "./models/signedKey";
import { getAWSService } from "./utils/aws";

const secretsClient = new SecretsManagerClient({ region });
const s3Client = new S3Client({ region });
const dynamoDbClient = new DynamoDBClient({ region });

const aws = getAWSService({ secretsClient, s3Client, dynamoDbClient })

export const getHandlerFunction = (aws: IAWSService) => async (event: IEvent): Promise<IResponse> => {

    try {
        const { bucket, key } = event.queryStringParameters
        if (!bucket || !key) {

            return RESPONSE_BAD_REQUEST
        }

        let certificate
        try {
            certificate = await aws.s3.readFile(bucket, key)
        } catch (e) {
            console.error(e)
            return RESPONSE_BAD_REQUEST
        }

        let certificateData
        try {
            certificateData = extractCertificate(certificate)
        } catch (e) {
            console.error(e)

            return RESPONSE_UNPROCESSABLE_ENTITY
        }

        const { commonName, publicKeyPem: payload } = certificateData

        const { privateKeyDKaba: ownPrivateKey } = await aws.secrets.getSecret(privateKeyId)

        const signed = sign(payload, ownPrivateKey)

        const keyItem = createSignedKeyEntry(commonName, signed)

        await aws.dynamoDb.putItem(signaturesTableName, keyItem)

        return RESPONSE_OK
    } catch (e) {
        console.error(e)

        return RESPONSE_SERVER_ERROR
    }
}

export const handler = getHandlerFunction(aws)
