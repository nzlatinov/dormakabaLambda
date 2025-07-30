import { S3Client, GetObjectCommand, GetObjectCommandOutput } from "@aws-sdk/client-s3";

export interface S3Service {
    readFile: (bucket: string, key: string) => Promise<string>
}

export const getS3Service = (client: S3Client): S3Service => ({
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
            console.log(`Could not read from S3: ${e}`)
            throw e
        }

        const data = await commandOutput.Body?.transformToString();
        if (!data) {
            console.log(`Bad certificate file: ${data}`);
            throw new Error(`Bad certificate file: ${data}`);
        }

        return data;
    }
