import {getRequest, putRequest} from "../../HttpMethods";
import {SuccessResult} from "../../SuccessResult";
import {getRandomDecimalSmall, getRandomInt} from "../../../components/BloodsRandomValues";

export let BloodsUESApi ={
    find(clientId: number, patientId: number): Promise<UES> {
        return getRequest(getBaseUrl(clientId,patientId));
    },
    update(clientId: number, patientId: number, updateUES: UES): Promise<SuccessResult> {
        return putRequest(getBaseUrl(clientId,patientId), updateUES);
    }
};


export interface UES {
    clientId: number,
    patientId: number,
    sodium: number,
    potassium: number,
    urea: number,
    creatinine: number,
    egfr: number,
}

export function emptyUES(): UES {
    return {
        clientId: 0,
        patientId: 0,
        sodium: getRandomInt(133,146),
        potassium: getRandomDecimalSmall(35,53),
        urea: getRandomDecimalSmall(25,78),
        creatinine: getRandomInt(45,104),
        egfr: getRandomInt(0,90)
    }
}

function getBaseUrl(clientId: number, patientId: number): string {
    return `/api/v1/clients/${clientId}/patients/${patientId}/bloods/ues`;
}
