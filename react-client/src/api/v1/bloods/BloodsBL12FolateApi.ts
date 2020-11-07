import {getRequest, putRequest} from "../../HttpMethods";
import {SuccessResult} from "../../SuccessResult";
import {getRandomInt} from "../../../components/BloodsRandomValues";

export let BloodsBL12FolateApi ={
    find(clientId: number, patientId: number): Promise<BL12Folate> {
        return getRequest(getBaseUrl(clientId,patientId));
    },
    update(clientId: number, patientId: number, updateBL12Folate: BL12Folate): Promise<SuccessResult> {
        return putRequest(getBaseUrl(clientId,patientId), updateBL12Folate);
    }
};


export interface BL12Folate {
    clientId: number,
    patientId: number,
    vitaminB12: number,
    folate: number,
}

export function emptyBL12Folate(): BL12Folate {
    return {
        clientId: 0,
        patientId: 0,
        vitaminB12: getRandomInt(180,1000),
        folate: getRandomInt(2,20)
    }
}

function getBaseUrl(clientId: number, patientId: number): string {
    return `/api/v1/clients/${clientId}/patients/${patientId}/bloods/bl12folate`;
}
