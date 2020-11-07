import {getRequest, postRequest} from "../HttpMethods";
import {IPaginatedList, IQueryRequest} from "../QueryRequest";

export let ScenarioEnvironmentApi = {
    create(clientId: number, scenarioId: number, environment: Environment): Promise<Environment> {
        return postRequest(getBaseUrl(clientId, scenarioId), environment);
    },
    find(clientId: number, scenarioId: number, queryRequest: IQueryRequest): Promise<IPaginatedList<Environment>> {
        return getRequest(getBaseUrl(clientId, scenarioId), queryRequest);
    },
    findById(clientId: number, scenarioId: number, id: number): Promise<Environment> {
        return getRequest(`${getBaseUrl(clientId, scenarioId)}/${id}`);
    },
    update(clientId: number, scenarioId: number, id: number, environment: Environment): Promise<Environment> {
        return postRequest(`${getBaseUrl(clientId, scenarioId)}/${id}`, environment);
    }
}

function getBaseUrl(clientId: number, scenarioId: number): string {
    return `/api/v1/clients/${clientId}/scenarios/${scenarioId}/environments`;
}


export interface Environment {
    scenarioId: number;
    id: number;
    name: string;
    image: string;
}

export function emptyEnvironment(): Environment {
    return {
        scenarioId: 0,
        id: 0,
        name: "",
        image: ""
    }
}