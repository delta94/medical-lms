import {getRequest, putRequest} from "../../HttpMethods";
import {SuccessResult} from "../../SuccessResult";
import {getRandomDecimalLarge, getRandomDecimalSmall, getRandomInt} from "../../../components/BloodsRandomValues";

export let BloodsBoneProfileApi ={
    find(clientId: number, patientId: number): Promise<BoneProfile> {
        return getRequest(getBaseUrl(clientId,patientId));
    },
    update(clientId: number, patientId: number, updateBoneProfile: BoneProfile): Promise<SuccessResult> {
        return putRequest(getBaseUrl(clientId,patientId), updateBoneProfile);
    }
};


export interface BoneProfile {
    clientId: number,
    patientId: number,
    correctedCalcium: number,
    alp: number,
    phosphate: number,
}

export function emptyBoneProfile(): BoneProfile {
    return {
        clientId: 0,
        patientId: 0,
        correctedCalcium: getRandomDecimalSmall(22,26),
        alp: getRandomInt(30,130),
        phosphate: getRandomDecimalLarge(74,140)
    }
}

function getBaseUrl(clientId: number, patientId: number): string {
    return `/api/v1/clients/${clientId}/patients/${patientId}/bloods/boneprofile`;
}
