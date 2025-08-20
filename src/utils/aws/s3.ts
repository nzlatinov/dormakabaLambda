import { S3Client, GetObjectCommand, GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { IS3Service } from "./aws.service.types";

export const getS3Service = (client: S3Client): IS3Service => ({
    readFile: getReadS3(client)
})

const getReadS3 = (client: S3Client) =>
    async (bucket: string, key: string): Promise<string> => {
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        let commandOutput: GetObjectCommandOutput

        try {
            commandOutput = await client.send(command)
        } catch (e) {
            console.error(`Could not read from S3: ${e}`)
            throw e
        }

        const data = await commandOutput.Body?.transformToString();
        if (!data) {
            console.error(`Bad certificate file: ${data}`);
            throw new Error(`Bad certificate file: ${data}`);
        }

        return data;
    }
