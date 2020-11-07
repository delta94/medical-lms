import {getRequest, putRequest} from "../HttpMethods";
import {SuccessResult} from "../SuccessResult";

export let ClerkingInfoApi = {
    find(clientId: number, patientId: number): Promise<ClerkingInfo> {
        return getRequest(getBaseUrl(clientId, patientId));
    },
    update(clientId: number, patientId: number, updatedClerkingInfo: ClerkingInfo): Promise<SuccessResult> {
        return putRequest(getBaseUrl(clientId, patientId), updatedClerkingInfo);
    }
};


export interface ClerkingInfo {
    clientId: number,
    patientId: number,
    currentComplaintHistory: string,
    medicalHistory: string,
    smokingStatus: boolean,
    alcoholConsumption: number,
    performanceStatus: string,
    adl: string,
    drugHistory: string,
    allergies: string,
    familyHistory: string,
    systemicReview: string
}

export function emptyClerkingInfo(): ClerkingInfo {
    return {
        clientId: 0,
        patientId: 0,
        currentComplaintHistory: '',
        medicalHistory: '',
        smokingStatus: false,
        alcoholConsumption: 0,
        performanceStatus: '',
        adl: '',
        drugHistory: '',
        allergies: '',
        familyHistory: '',
        systemicReview: ''
    }
}

function getBaseUrl(clientId: number, patientId: number): string {
    return `/api/v1/clients/${clientId}/patients/${patientId}/clerking`;
}
