import {getRequest, putRequest} from "../../HttpMethods";
import {SuccessResult} from "../../SuccessResult";
import {getRandomDecimalSmall, getRandomInt} from "../../../components/BloodsRandomValues";

export let BloodsCoagulationApi ={
    find(clientId: number, patientId: number): Promise<Coagulation> {
        return getRequest(getBaseUrl(clientId,patientId));
    },
    update(clientId: number, patientId: number, updateCoagulation: Coagulation): Promise<SuccessResult> {
        return putRequest(getBaseUrl(clientId,patientId), updateCoagulation);
    }
};


export interface Coagulation {
    clientId: number,
    patientId: number,
    pt: number,
    aptt: number,
    fibrinogen: number,
}

export function emptyCoagulation(): Coagulation {
    return {
        clientId: 0,
        patientId: 0,
        pt: getRandomInt(10,14),
        aptt: getRandomInt(24,37),
        fibrinogen: getRandomDecimalSmall(15,45)
    }
}

function getBaseUrl(clientId: number, patientId: number): string {
    return `/api/v1/clients/${clientId}/patients/${patientId}/bloods/coagulation`;
}
