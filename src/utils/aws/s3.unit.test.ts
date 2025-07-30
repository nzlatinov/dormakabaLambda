import { S3Client } from "@aws-sdk/client-s3";
import { certificateFixture } from "../../fixtures";
import { getS3Service } from "./s3";

describe('The s3 service ', () => {
    describe('readFile method ', () => {

        it('should return certificate for correct arguments', async () => {
            const clientMock = {
                send: () => ({
                    Body: {
                        transformToString: async () => certificateFixture
                    }
                })
            } as unknown as S3Client

            const readFile = getS3Service(clientMock).readFile

            const result = await readFile('buck', 'key')

            expect(result).toBe(certificateFixture)
        })

        it('should throw for incorrect bucket or key', async () => {
            const clientMock = {
                send: () => { throw new Error() }
            } as unknown as S3Client

            const readFile = getS3Service(clientMock).readFile

            await expect(readFile('badBucket', 'key')).rejects.toThrow()
        })

        it('should throw if file is empty', async () => {
            const clientMock = {
                send: () => ({
                    Body: {
                        transformToString: async () => ''
                    }
                })
            } as unknown as S3Client

            const readFile = getS3Service(clientMock).readFile

            await expect(readFile('buck', 'key')).rejects.toThrow()
        })
    })
})
