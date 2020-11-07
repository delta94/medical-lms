import {getRequest, postRequest, putRequest} from "../HttpMethods";
import {PaginatedList} from "../../../../server/src/PaginatedList";


export let ScenarioDecisionApi = {

    findAttemptById(clientId: number, scenarioId: number, attemptId: number): Promise<ScenarioBaseAttempt> {
        return getRequest(`${getBaseUrl(clientId, scenarioId)}/${attemptId}`);
    },

    findAttempt(clientId: number, scenarioId: number): Promise<PaginatedList<ScenarioBaseAttempt>> {
        return getRequest(`${getBaseUrl(clientId, scenarioId)}`);
    },

    createAttempt(clientId: number, scenarioId: number): Promise<ScenarioBaseAttempt> {
        return postRequest(getBaseUrl(clientId, scenarioId));
    },

    updateAttempt(clientId: number, scenarioId: number, attempt: ScenarioBaseAttempt): Promise<ScenarioBaseAttempt>{
        return putRequest(getBaseUrl(clientId, scenarioId), attempt);
    },

    createDecision(clientId: number, scenarioId: number, decision: ScenarioDecision): Promise<ScenarioDecision>{
        return postRequest(getDecisionsBaseUrl(clientId, scenarioId, decision.attemptId), decision);
    },

    getDecisions(clientId: number, scenarioId: number, attemptId: number): Promise<Array<ScenarioDecision>>{
        return getRequest(getDecisionsBaseUrl(clientId, scenarioId, attemptId));
    },

}

function getBaseUrl(clientId: number, scenarioId: number): string {
    return  `/api/v1/clients/${clientId}/scenario-attempts/${scenarioId}`;
}

function getDecisionsBaseUrl(clientId: number, scenarioId: number, attemptId: number): string {
    return  `${getBaseUrl(clientId, scenarioId)}/${attemptId}/decisions`;
}

export function emptyScenarioBaseAttempt() : ScenarioBaseAttempt{
    return ({
        attemptId: 0,
        clientId: 0,
        scenarioId: 0,
        completed: false
    });
}

export interface ScenarioBaseAttempt{
    attemptId: number;
    clientId: number;
    scenarioId: number;
    completed: boolean;
    timeStarted?: Date;
    timeFinished?: Date;
}

export interface ScenarioDecision {
    attemptId: number;
    step: number;
    decision: any;
}

export interface ScenarioFullAttempt extends ScenarioBaseAttempt{
    decisions: Array<any>;
}