import { marshall } from "@aws-sdk/util-dynamodb";

export const createSignedKeyEntry = (commonName: string, signedKey: string) => marshall({
    commonName,
    signedKey,
    timestamp: Date.now()
})
