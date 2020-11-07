import {getRequest, postRequest, putRequest} from "../HttpMethods";
import {IPaginatedList, IQueryRequest} from "../QueryRequest";

export let PhysicalExamResultsApi ={
    create(clientId: number, patientId: number, newPhysicalExamResult: PhysicalExamResults): Promise<PhysicalExamResults> {
        return postRequest(getBaseUrl(clientId, patientId), newPhysicalExamResult);
    },
    findById(clientId: number, patientId: number, id: number): Promise<PhysicalExamResults> {
        return getRequest(`${getBaseUrl(clientId,patientId)}/${id}`);
    },
    update(clientId: number, patientId: number,  id: number, updatedExamResult: PhysicalExamResults): Promise<PhysicalExamResults> {
        return putRequest(`${getBaseUrl(clientId,patientId)}/${id}`, updatedExamResult);
    },
    find(clientId: number, patientId: number, queryRequest: IQueryRequest): Promise<IPaginatedList<PhysicalExamResultsFind>> {
        return getRequest(getBaseUrl(clientId,patientId), queryRequest);
    }
};


export interface PhysicalExamResults {
    id: number;
    clientId: number;
    patientId: number;
    regionId: number;
    result: string;
    appropriate: boolean;
}

export function emptyPhysicalExamResults(): PhysicalExamResults {
    return {
        id: 0,
        clientId: 0,
        patientId: 0,
        regionId: 0,
        result: '',
        appropriate: true
    }
}

export interface PhysicalExamResultsFind {
    id: number;
    clientId: number;
    patientId: number;
    regionId: number;
    result: string;
    appropriate: boolean;
    name: string;
}

function getBaseUrl(clientId: number, patientId: number): string {
    return `/api/v1/clients/${clientId}/patients/${patientId}/physicalexam/results`;
}
