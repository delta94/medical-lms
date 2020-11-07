export interface FidoCredential {
    userId: number;
    credentialId: Uint8Array;
    publicKey: Uint8Array;
    signatureCounter: number;
    createdAt: Date;
    aaGuid: string;
    identifier: string;
}

export interface Authenticator {
    id: string;
    identifier: string;
    createdAt: Date;
}