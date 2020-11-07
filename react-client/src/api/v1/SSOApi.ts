import {getRequest, putRequest} from "../HttpMethods";
import {SuccessResult} from "../SuccessResult";

export let SSOApi = {
    find(clientId: number): Promise<SSO> {
        return getRequest(getBaseUrl(clientId));
    },
    update(clientId: number, updatedSSO: SSO): Promise<SuccessResult> {
        return putRequest(getBaseUrl(clientId), updatedSSO);
    }
};

export interface SSO {
    clientId: number;
    endpoint: string;
    certificate: string;
}

export function emptySso(): SSO {
    return {
        clientId: 0,
        endpoint: "",
        certificate: ""
    }
}

function getBaseUrl(clientId: number): string {
    return `/api/v1/clients/${clientId}/settings/sso`;
}
