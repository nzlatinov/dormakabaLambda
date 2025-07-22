import { S3Client, GetObjectCommand, GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { region } from "../../constants";

export type ReadS3FileFunction = typeof readS3File

export const createGetCertificate = (fileReader: ReadS3FileFunction) => async (bucket: string, key: string) => {
    try {
        const data = (await fileReader(bucket, key))
            .Body
            ?.transformToString();

        if (!data) {
            throw new Error(`Bad certificate file: ${data}`);
        }

        return data;
    } catch (e) {
        console.log(`Could not get certificate: ${e}`)
        throw e
    }
}

async function readS3File(bucket: string, key: string): Promise<GetObjectCommandOutput> {
    try {
        const s3 = new S3Client({ region });
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        return s3.send(command)
    } catch (e) {
        console.log(`Could not read from S3: ${e}`)
        throw e
    }
}

export const getCertificate = createGetCertificate(readS3File)