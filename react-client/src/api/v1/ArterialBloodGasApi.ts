import {getRequest, putRequest} from "../HttpMethods";
import {SuccessResult} from "../SuccessResult";
import {getRandomDecimalLarge, getRandomDecimalSmall, getRandomInt} from "../../components/BloodsRandomValues";

export let ArterialBloodGasApi ={
    find(clientId: number, patientId: number): Promise<ArterialBloodGas> {
        return getRequest(getBaseUrl(clientId,patientId));
    },
    update(clientId: number, patientId: number, updateArterialBloodGas: ArterialBloodGas): Promise<SuccessResult> {
        return putRequest(getBaseUrl(clientId,patientId), updateArterialBloodGas);
    }
};


export interface ArterialBloodGas {
    clientId: number,
    patientId: number,
    ph: number,
    pao2: number,
    paco2: number,
    hco3: number,
    baseExcess: number,
    lactate: number,

}

export function emptyArterialBloodGas(): ArterialBloodGas {
    return {
        clientId: 0,
        patientId: 0,
        ph: getRandomDecimalLarge(735,745),
        pao2: getRandomInt(11,13),
        paco2: getRandomDecimalSmall(47,60),
        hco3: getRandomInt(22,26),
        baseExcess: getRandomInt(-2,2),
        lactate: getRandomDecimalSmall(5,22)
    }
}

function getBaseUrl(clientId: number, patientId: number): string {
    return `/api/v1/clients/${clientId}/patients/${patientId}/abg`;
}
