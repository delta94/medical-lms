import {deleteRequest, getRequest, postRequest, putRequest} from "../HttpMethods";
import {IPaginatedList, IQueryRequest} from "../QueryRequest";

export let PatientApi = {
    create(clientId: number, newPatient: Patient): Promise<Patient> {
        return postRequest(getBaseUrl(clientId), newPatient);
    },
    find(clientId: number, queryRequest: IQueryRequest): Promise<IPaginatedList<Patient>> {
        return getRequest(getBaseUrl(clientId), queryRequest);
    },
    findById(clientId: number, id: number): Promise<Patient> {
        return getRequest(`${getBaseUrl(clientId)}/${id}`);
    },
    update(clientId: number, id: number, updatedPatient: Patient): Promise<Patient> {
        return putRequest(`${getBaseUrl(clientId)}/${id}`, updatedPatient);
    },
    delete(clientId: number, id: number): Promise<Patient> {
        return deleteRequest(`${getBaseUrl(clientId)}/${id}`);
    }
};

function getBaseUrl(clientId: number): string {
    return  `/api/v1/clients/${clientId}/patients`;
}

export function calcBMI(patient: Patient): string {
    return (patient.weight / Math.pow(patient.height, 2)).toFixed(1)
}

export interface Patient {
    clientId: number;
    id: number;
    name: string;
    age: number;
    isFemale: boolean;
    description: string;
    height: number;
    weight: number;
    ethnicity: string;
    updatedAt: string;
    createdAt: string;
}

export function emptyPatient(): Patient {
    return {
        clientId: 0,
        id: 0,
        name: "",
        age: 0,
        isFemale: false,
        description: "",
        height: 0,
        weight: 0,
        ethnicity: "",
        updatedAt: "",
        createdAt: ""
    }


}

