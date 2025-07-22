import { formatPrivateKey } from "./strings"

describe('formatPrivateKey', () => {

    it('should attach first and last line to key value', async () => {
        const firsLine = '-----BEGIN RSA PRIVATE KEY-----\n'
        const lastLine = '\n-----END RSA PRIVATE KEY-----'
        const expected = `-----BEGIN RSA PRIVATE KEY-----\nsecret key\n-----END RSA PRIVATE KEY-----`

        const result = formatPrivateKey('secret key')

        expect(result).toMatch(new RegExp(`^${firsLine}`));
        expect(result).toMatch(new RegExp(`${lastLine}$`));
        expect(result).toBe(expected);
    })
})
