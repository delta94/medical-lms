import {getRequest, putRequest} from "../HttpMethods";
import {SuccessResult} from "../SuccessResult";

export let FeatureFlagApi = {
    getEnabledFeatures(): Promise<string[]> {
        return getRequest("/api/v1/account/features");
    },
    get(clientId: number): Promise<IFeatureFlagEdit> {
        return getRequest(getBaseUrl(clientId))
            .then(data => {
                data.global = new Map<string, IFeatureObject>(Object.entries(data.global));
                data.client = new Map<string, IFeatureStatus>(Object.entries(data.client));

                return data;
            });
    },
    set(clientId: number, flags: Map<string, IFeatureStatus>): Promise<SuccessResult> {
        return putRequest(getBaseUrl(clientId), Object.fromEntries(flags));
    }
};

function getBaseUrl(clientId: number): string {
    return `/api/v1/clients/${clientId}/features`;
}

export interface IFeatureFlagEdit {
    global: Map<string, IFeatureObject>,
    client: Map<string, IFeatureStatus>
}

export interface IFeatureObject {
    label: string;
    description: string;
    status: IFeatureStatus
}

export interface IFeatureStatus {
    enabled: boolean | null;
    force?: boolean;
}