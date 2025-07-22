import { privateKeySecretFixture, publicKeyFixture } from "../../fixtures"
import { sign } from "./sign"

describe('The sign function ', () => {

    it('should return signature for valid inputs', async () => {
        const expected = 'hyNPbG2HYTfINKopCccuJ/tWJ9jkZHo8mXZXRRG10uL7vVVdV9Nl9hRCYwM3njKnot016ZSVCcjpUC7m4VuI8zfF/FO1EEcg2CwbZtwP4owHliIqvZvVgqQh6MWj5caFuTKTZZgCXhB1kff8EDQ++eLblXStTDYFdhLrMQgneUnElZpUOXBm8ZnD3HH6reDuednbuF8bcbZhuz35Llm67SgpnofHufv6C5b72KI+HneEcJEwE/TIY437eKKj/YoPxctyhh7wEbAGWsYerg4Kq/9qccSU1pAZIxBm8ZT4t3GceQVPpnHgLIK23m1dJeoWcxoZ8ZI6i7YYjCls+7hLaQ=='

        const result = sign(publicKeyFixture, privateKeySecretFixture)

        expect(result).toBe(expected);
    })

    it('should throw when the private key is corrupted', async () => {
        const invoke = () => sign(publicKeyFixture, privateKeySecretFixture + 'corruption')

        expect(invoke).toThrow()
    })
})
