import {getRequest, putRequest} from "../HttpMethods";
import {IChart} from "@mrblenny/react-flow-chart/src";
import {SuccessResult} from "../SuccessResult";

export let ScenarioGraphApi = {
    findNodeArray(clientId: number, scenarioId: number): Promise<any> {
        return getRequest(`/api/v1/clients/${clientId}/scenarios/${scenarioId}/graph/data`);
    },
    get(clientId: number, scenarioId: number): Promise<IChart> {
        return getRequest(getBaseUrl(clientId, scenarioId));
    },
    set(clientId: number, scenarioId: number, graph: IChart): Promise<SuccessResult> {
        return putRequest(getBaseUrl(clientId, scenarioId), graph);
    }
}

function getBaseUrl(clientId: number, scenarioId: number): string {
    return `/api/v1/clients/${clientId}/scenarios/${scenarioId}/graph`;
}

export enum NodeType {
    Start = 0,
    Text = 1,
    Option = 2,
    Conditional = 3,
    Outcome = 4,
    PhysicalExam = 5,
    PatientInfo = 6,
    ClerkingInfo = 7,
    BloodTests = 8,
    Environment = 9,
    ArterialBloodGas = 10,
    ChangeFlag = 12
}
