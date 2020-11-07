import {deleteRequest, getRequest, postRequest, putRequest} from "../HttpMethods";
import {IPaginatedList, IQueryRequest} from "../QueryRequest";
import {SuccessResult} from "../SuccessResult";

export let ScenarioSpeakerApi = {
    create(clientId: number, scenarioId: number, newScenarioSpeaker: ScenarioSpeaker): Promise<ScenarioSpeaker> {
        return postRequest(getBaseUrl(clientId,scenarioId), newScenarioSpeaker);
    },
    find(clientId: number, scenarioId: number, queryRequest: IQueryRequest): Promise<IPaginatedList<ScenarioSpeaker>> {
        return getRequest(getBaseUrl(clientId, scenarioId), queryRequest);
    },
    findById(clientId: number, scenarioId: number, id: number): Promise<ScenarioSpeaker> {
        return getRequest(`${getBaseUrl(clientId,scenarioId)}/${id}`);
    },
    findByName(clientId: number, scenarioId: number, name: string): Promise<ScenarioSpeaker>{
        return getRequest(`${getBaseUrl(clientId,scenarioId)}/${name}`);
    },
    update(clientId: number, scenarioId: number, id: number, updatedScenarioSpeaker: ScenarioSpeaker): Promise<ScenarioSpeaker> {
        return putRequest(`${getBaseUrl(clientId, scenarioId)}/${id}`, updatedScenarioSpeaker);
    },
    delete(clientId: number, scenarioId: number, id: number): Promise<SuccessResult> {
        return deleteRequest(`${getBaseUrl(clientId,scenarioId)}/${id}`);
    }
};

function getBaseUrl(clientId: number, scenarioId: number,): string {
    return  `/api/v1/clients/${clientId}/scenarios/${scenarioId}/speakers`;
}

export interface ScenarioSpeaker {
    clientId: number;
    scenarioId: number;
    id: number;
    name: string;
    avatar: string;
}

export function emptyScenarioSpeaker(): ScenarioSpeaker {
    return {
        clientId: 0,
        scenarioId: 0,
        id: 0,
        name: "",
        avatar: ""
    }
}

