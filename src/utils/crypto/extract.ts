import { X509Certificate } from 'crypto';
import { ICertificateData } from './crypto.types';

export const extractCertificate = (certificate: string): ICertificateData => {

    try {
        const certBuffer = Buffer.from(certificate)
        const cert = new X509Certificate(certBuffer);

        const commonName = cert
            .subject
            .split('\n')
            .find((line) => line.startsWith('CN='))
            ?.replace('CN=', '')

        if (!commonName) {
            throw new Error('No commonName(CN) in certificate')
        }

        const publicKeyPem = cert
            .publicKey
            .export({ format: 'pem', type: 'spki' })
            .toString();

        return { commonName, publicKeyPem }
    } catch (e) {
        console.error('Could not extract certificate data', { e, certificate })
        throw e
    }
}
