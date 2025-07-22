import { certificateFixture, certificateNoCommonNameFixture, publicKeyFixture } from "../../fixtures"
import { extractCertificate } from "./extract"

describe('The extract function ', () => {

    it('should extract data from a valid certificate', async () => {

        const result = extractCertificate(certificateFixture)

        expect(result).toHaveProperty('commonName')
        expect(result.commonName).toBe('localhost')

        expect(result).toHaveProperty('publicKeyPem')
        expect(result.publicKeyPem.trim()).toBe(publicKeyFixture)
    })

    it('should throw when the certificate is not valid', async () => {
        let logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        const temeperedCertificate = certificateFixture.slice(0, 100) + certificateFixture.slice(200, certificateFixture.length)

        const invoke = () => extractCertificate(temeperedCertificate)

        expect(invoke).toThrow()

        logSpy.mockRestore()
    })

    it('should throw when the certificate has no CommonName', async () => {
        let logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        const invoke = () => extractCertificate(certificateNoCommonNameFixture)

        expect(invoke).toThrow()

        logSpy.mockRestore()
    })
})
