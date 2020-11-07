import {getRequest, putRequest} from "../../HttpMethods";
import {SuccessResult} from "../../SuccessResult";
import {getRandomInt} from "../../../components/BloodsRandomValues";

export let BloodsLFTSApi ={
    find(clientId: number, patientId: number): Promise<LFTS> {
        return getRequest(getBaseUrl(clientId,patientId));
    },
    update(clientId: number, patientId: number, updateLFTS: LFTS): Promise<SuccessResult> {
        return putRequest(getBaseUrl(clientId,patientId), updateLFTS);
    }
};


export interface LFTS {
    clientId: number,
    patientId: number,
    alp: number,
    alt: number,
    bilirubin: number,
    albumin: number
}

export function emptyLFTS(): LFTS {
    return {
        clientId: 0,
        patientId: 0,
        alp: getRandomInt(30,130),
        alt: getRandomInt(0,41),
        bilirubin: getRandomInt(0,21),
        albumin: getRandomInt(35,50)
    }
}

function getBaseUrl(clientId: number, patientId: number): string {
    return `/api/v1/clients/${clientId}/patients/${patientId}/bloods/lfts`;
}
