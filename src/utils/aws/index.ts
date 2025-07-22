import { persistSignature } from "./dynamoDB";
import { getCertificate } from "./s3";
import { getPrivateKeySecret } from "./secrets";

export type AWSService = typeof aws

export const aws = {
    getCertificate,
    persistSignature,
    getPrivateKeySecret
}