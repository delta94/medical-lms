import {getRequest, putRequest} from "../../HttpMethods";
import {SuccessResult} from "../../SuccessResult";
import {getRandomDecimalSmall, getRandomInt} from "../../../components/BloodsRandomValues";

export let BloodsTFTSApi ={
    find(clientId: number, patientId: number): Promise<TFTS> {
        return getRequest(getBaseUrl(clientId,patientId));
    },
    update(clientId: number, patientId: number, updateTFTS: TFTS): Promise<SuccessResult> {
        return putRequest(getBaseUrl(clientId,patientId), updateTFTS);
    }
};


export interface TFTS {
    clientId: number,
    patientId: number,
    tsh: number,
    freeT4: number,
    freeT3: number,
}

export function emptyTFTS(): TFTS {
    return {
        clientId: 0,
        patientId: 0,
        tsh: getRandomDecimalSmall(4,40),
        freeT4: getRandomInt(9,24),
        freeT3: getRandomDecimalSmall(35,78)
    }
}

function getBaseUrl(clientId: number, patientId: number): string {
    return `/api/v1/clients/${clientId}/patients/${patientId}/bloods/tfts`;
}
