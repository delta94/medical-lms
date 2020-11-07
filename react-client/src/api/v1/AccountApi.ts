import {getRequest, postRequest, putRequest} from "../HttpMethods";
import {Client} from "./ClientApi";

export let AccountApi = {
    samlLogin(): Promise<any> {
        return getRequest(`${getBaseUrl()}/login/saml`);
    },
    login(email: string, password: string): Promise<any> {
        return postRequest(`${getBaseUrl()}/login`, {email, password});
    },
    totpLogin(email: string, password: string, code: string, useRecoveryCode: boolean): Promise<any> {
        let body = {
            email,
            password
        };
        if (useRecoveryCode) {
            body["recoveryCode"] = code;
        } else {
            body["code"] = code;
        }
        return postRequest(`${getBaseUrl()}/login/two-factor/totp`, body);
    },
    setLanguage(language: string): Promise<any> {
        return postRequest(`${getBaseUrl()}/language`, {language});
    },
    changePassword(currentPassword: string, newPassword: string): Promise<any> {
        return putRequest(`${getBaseUrl()}/password`, {currentPassword, newPassword});
    },
    getClient(): Promise<Client> {
        return getRequest(`${getBaseUrl()}/client`);
    }
};

function getBaseUrl(): string {
    return `/api/v1/account`;
}