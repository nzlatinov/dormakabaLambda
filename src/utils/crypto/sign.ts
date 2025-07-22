import { createSign } from 'crypto';
import { formatPrivateKey } from '../formatting/strings';

export const sign = (payload: string, keyData: string) => {
    const signer = createSign('sha256');

    signer.update(payload);
    signer.end();

    const privateKey = formatPrivateKey(keyData)

    const signature = signer.sign(privateKey, 'base64');

    return signature
}

// if I was generating key instead of secret to use in sign()

// const generateKeyPairAsync = promisify(generateKeyPair);

// const createKeyPair = async () => {
//     const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
//         modulusLength: 2048,
//         publicKeyEncoding: {
//             type: 'pkcs1',
//             format: 'pem',
//         },
//         privateKeyEncoding: {
//             type: 'pkcs1',
//             format: 'pem',
//         },
//     });

//     return { publicKey, privateKey }
// }
