import {getRequest, putRequest} from "../../HttpMethods";
import {SuccessResult} from "../../SuccessResult";
import {getRandomDecimalSmall, getRandomInt} from "../../../components/BloodsRandomValues";

export let BloodsOtherApi ={
    find(clientId: number, patientId: number): Promise<Other> {
        return getRequest(getBaseUrl(clientId,patientId));
    },
    update(clientId: number, patientId: number, updateOther: Other): Promise<SuccessResult> {
        return putRequest(getBaseUrl(clientId,patientId), updateOther);
    }
};


export interface Other {
    clientId: number,
    patientId: number,
    magnesium: number,
    amylase: number,
    crp: number,
    haematinicsFerritin: number,
    troponinI: number,
    hba1c: number,
    lactate: number
}

export function emptyOther(): Other {
    return {
        clientId: 0,
        patientId: 0,
        magnesium: getRandomDecimalSmall(7,10),
        amylase: getRandomInt(28,100),
        crp: getRandomInt(0,5),
        haematinicsFerritin: getRandomInt(10,350),
        troponinI: getRandomDecimalSmall(0,4),
        hba1c: getRandomInt(0,42),
        lactate: getRandomDecimalSmall(5,22)
    }
}

function getBaseUrl(clientId: number, patientId: number): string {
    return `/api/v1/clients/${clientId}/patients/${patientId}/bloods/other`;
}
