export const region = process.env.REGION || ''
export const privateKeyId = process.env.PRIVATE_KEY_ID || ''
export const signaturesTableName = process.env.TABLE_NAME || ''

export const RESPONSE_OK = {
    body: 'OK',
    statusCode: 200
}

export const RESPONSE_BAD_REQUEST = {
    body: 'Bad Request',
    statusCode: 400
}

export const RESPONSE_UNPROCESSABLE_ENTITY = {
    body: 'Unprocessable Entity',
    statusCode: 422
}

export const RESPONSE_SERVER_ERROR = {
    body: 'Internal Server Error',
    statusCode: 500
}

