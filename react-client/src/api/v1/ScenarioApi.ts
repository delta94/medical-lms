import {deleteRequest, getRequest, postRequest, putRequest} from "../HttpMethods";
import {IPaginatedList, IQueryRequest} from "../QueryRequest";
import {Patient} from "./PatientApi";
import {SuccessResult} from "../SuccessResult";

export let ScenarioApi = {
    create(clientId: number, newScenario: Scenario): Promise<Scenario> {
        return postRequest(getBaseUrl(clientId), newScenario);
    },
    find(clientId: number, queryRequest: IQueryRequest): Promise<IPaginatedList<Scenario>> {
        return getRequest(getBaseUrl(clientId), queryRequest);
    },
    findNotEmpty(clientId: number, queryRequest: IQueryRequest): Promise<IPaginatedList<Scenario>> {
        return getRequest(`${getBaseUrl(clientId)}/not-empty`, queryRequest);
    },
    findById(clientId: number, id: number): Promise<Scenario> {
        return getRequest(`${getBaseUrl(clientId)}/${id}`);
    },
    update(clientId: number, id: number, updatedScenario: Scenario): Promise<Scenario> {
        return putRequest(`${getBaseUrl(clientId)}/${id}`, updatedScenario);
    },
    delete(clientId: number, id: number): Promise<Scenario> {
        return deleteRequest(`${getBaseUrl(clientId)}/${id}`);
    },
    findPatients(clientId: number, scenarioId: number, queryRequest: IQueryRequest): Promise<IPaginatedList<Patient>> {
        return getRequest(`${getBaseUrl(clientId)}/${scenarioId}/patients`, queryRequest);
    },
    addPatient(clientId: number, scenarioId: number, patientId: number): Promise<SuccessResult> {
        return postRequest(`${getBaseUrl(clientId)}/${scenarioId}/patients`, {patientId});
    },
    removePatient(clientId: number, scenarioId: number, patientId: number): Promise<SuccessResult> {
        return deleteRequest(`${getBaseUrl(clientId)}/${scenarioId}/patients/${patientId}`);
    }
};

function getBaseUrl(clientId: number): string {
    return  `/api/v1/clients/${clientId}/scenarios`;
}

export interface Scenario {
    clientId: number;
    id: number;
    name: string;
    description: string;
    active: boolean;
    coverImage: string;
    updatedAt: string;
    createdAt: string;
}

export function emptyScenario(): Scenario {
    return {
        clientId: 0,
        id: 0,
        name: "",
        description: "",
        coverImage: "",
        active: false,
        updatedAt: "",
        createdAt: ""
    }
}

