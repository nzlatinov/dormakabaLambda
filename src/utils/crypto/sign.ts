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
