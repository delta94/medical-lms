import {SuccessResult} from "../SuccessResult";
import {deleteRequest, getRequest, postRequest, putRequest} from "../HttpMethods";

export let MfaApi = {
    mfaIsSetup(): Promise<{enabled: boolean}> {
        return getRequest(`${getBaseUrl()}/enabled`);
    },
    verifyRecoveryCode(email: string, code: string): Promise<SuccessResult> {
        return postRequest(`${getBaseUrl()}/recovery`, {email, code})
    },
    findRecoveryCodes(): Promise<string[]> {
        return getRequest(`${getBaseUrl()}/recovery-codes`);
    },
    generateRecoveryCodes(regenerate: boolean = false): Promise<SuccessResult> {
        return postRequest(`${getBaseUrl()}/recovery-codes?regenerate=${regenerate}`)
    },
    disableMfa(): Promise<SuccessResult> {
        return putRequest(`${getBaseUrl()}/disable`);
    }
}

export let TotpApi = {
    getTotpSetup(): Promise<TotpSetup> {
        return getRequest(`${getBaseUrl()}/totp/setup`);
    },
    verifyTotpSetup(code: number): Promise<any> {
        return postRequest(`${getBaseUrl()}/totp/setup`, {code: code.toString()});
    },
    verifyTotpCode(email: string, code: number): Promise<any> {
        return postRequest(`${getBaseUrl()}/totp`, {email, code});
    },
    isTotpEnabled(email: string | null = null): Promise<boolean> {
        return getRequest(`${getBaseUrl()}/totp${email != null ? `?email=${email}` : ""}`);
    },
    disableTotp(): Promise<boolean> {
        return deleteRequest(`${getBaseUrl()}`);
    }
}

export function getBaseUrl(): string {
    return "/api/v1/account/mfa";
}

export interface TotpSetup {
    manualSetupKey: string,
    qrCodeImage: string
}