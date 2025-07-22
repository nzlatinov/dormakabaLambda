import * as dotenv from "dotenv"
dotenv.config()

import { aws, AWSService } from "./utils/aws/index"
import { extractCertificate } from "./utils/crypto/extract"
import { sign } from "./utils/crypto/sign"
import {
    RESPONSE_OK,
    RESPONSE_BAD_REQUEST,
    RESPONSE_SERVER_ERROR,
    RESPONSE_UNPROCESSABLE_ENTITY,
} from "./constants"

export interface Event {
    queryStringParameters: {
        bucket?: string,
        key?: string
    }
}

export interface Response {
    statusCode: number,
    body: string
}


export const getHandlerFunction = (aws: AWSService) => async (event: Event): Promise<Response> => {

    try {
        const { bucket, key } = event.queryStringParameters
        if (!bucket || !key) {

            return RESPONSE_BAD_REQUEST
        }

        let certificate
        try {
            certificate = await aws.getCertificate(bucket, key)
        } catch (e) {
            console.log(e)
            return RESPONSE_BAD_REQUEST
        }

        let certificateData
        try {
            certificateData = extractCertificate(certificate)
        } catch (e) {
            console.log(e)

            return RESPONSE_UNPROCESSABLE_ENTITY
        }

        const { commonName, publicKeyPem: payload } = certificateData

        const ownPrivateKey = await aws.getPrivateKeySecret()

        const signed = sign(payload, ownPrivateKey)

        await aws.persistSignature(commonName, signed)

        return RESPONSE_OK
    } catch (e) {
        console.log(e)

        return RESPONSE_SERVER_ERROR
    }
}

export const handler = getHandlerFunction(aws)
