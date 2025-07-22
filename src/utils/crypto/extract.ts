import { X509Certificate } from 'crypto';

interface CertificateData {
    commonName: string,
    publicKeyPem: string
}

export const extractCertificate = (certificate: string): CertificateData => {

    try {
        const certBuffer = Buffer.from(certificate)
        const cert = new X509Certificate(certBuffer);

        const commonName = cert
            .subject
            .split('\n')
            .find((line) => line.startsWith('CN='))
            ?.slice(3)

        if (!commonName) {
            throw new Error('No commonName(CN) in certificate')
        }

        const publicKeyPem = cert
            .publicKey
            .export({ format: 'pem', type: 'spki' })
            .toString();

        return { commonName, publicKeyPem }
    } catch (e) {
        console.log('Could not extract certificate data', { e, certificate })
        throw e
    }
}
