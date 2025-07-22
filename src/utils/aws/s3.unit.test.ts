import { GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { certificateFixture } from "../../fixtures";
import { createGetCertificate, ReadS3FileFunction } from "./s3";

const readFileResponseMock: GetObjectCommandOutput = {
    Body: {
        transformToString: async () => certificateFixture
    }
} as GetObjectCommandOutput

const readS3FileMock: ReadS3FileFunction = async (buck: string, key: string) => {
    if (buck === 'badBucket') {
        throw new Error('could not find bucket')
    }

    return readFileResponseMock
}


describe('The getCertificate function ', () => {

    it('should return certificate for correct arguments', async () => {
        const readS3FileMock = async () => readFileResponseMock
        const getCertificate = createGetCertificate(readS3FileMock)

        const result = await getCertificate('buck', 'key')

        expect(result).toBe(certificateFixture)
    })

    it('should throw for incorrect bucket or key', async () => {
        const getCertificate = createGetCertificate(readS3FileMock)


        await expect(getCertificate('badBucket', 'key')).rejects.toThrow()
    })

    it('should throw if file is empty', async () => {
        let outputSpy = jest.spyOn(readFileResponseMock.Body!, 'transformToString')
            .mockImplementation(async () => '');

        const getCertificate = createGetCertificate(readS3FileMock)

        await expect(getCertificate('badBucket', 'key')).rejects.toThrow()

        outputSpy.mockRestore()
    })

})
