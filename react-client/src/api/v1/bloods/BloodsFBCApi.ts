import {getRequest, putRequest} from "../../HttpMethods";
import {SuccessResult} from "../../SuccessResult";
import {getRandomDecimalSmall, getRandomInt} from "../../../components/BloodsRandomValues";

export let BloodsFBCApi ={
    find(clientId: number, patientId: number): Promise<FBC> {
        return getRequest(getBaseUrl(clientId,patientId));
    },
    update(clientId: number, patientId: number, updatedFBC: FBC): Promise<SuccessResult> {
        return putRequest(getBaseUrl(clientId,patientId), updatedFBC);
    }
};


export interface FBC {
    clientId: number,
    patientId: number,
    hb: number,
    mcv: number,
    mch: number,
    totalWcc: number,
    neutrophils: number,
    lymphocytes: number,
    monocytes: number,
    eosinophils: number,
    platelets: number
}

export function emptyFBC(): FBC {
    return {
        clientId: 0,
        patientId: 0,
        hb: getRandomInt(115,180),
        mcv: getRandomInt(80,100),
        mch: getRandomInt(27,32),
        totalWcc: getRandomDecimalSmall(36,110),
        neutrophils: getRandomDecimalSmall(18,75),
        lymphocytes: getRandomDecimalSmall(10,40),
        monocytes: getRandomDecimalSmall(2,8),
        eosinophils: getRandomDecimalSmall(1,4),
        platelets: getRandomInt(140,400)
    }
}

function getBaseUrl(clientId: number, patientId: number): string {
    return `/api/v1/clients/${clientId}/patients/${patientId}/bloods/fbc`;
}
