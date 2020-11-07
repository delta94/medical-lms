import CaseFlags from "../CaseFlags";
import {Patient} from "../../api/v1/PatientApi";
import {Environment} from "../../api/v1/ScenarioEnvironmentApi";

export interface StateInfo {
    clientId: number;
    scenarioId: number;

    node: GraphNode | null;
    step: any;
    flags: CaseFlags;
    patients: Patient[];
    environment: Environment;

    addPatient: ((patient: Patient) => void);
    setEnvironment: ((environment: Environment) => void);
}

export abstract class GraphNode {
    id: string;

    public inc: string[] | undefined;
    public dec: string[] | undefined;
    public set: any | undefined;
    public reset: string[] | undefined;
    public component: ((props: INodeProps) => JSX.Element) | null;

    protected constructor(nodeData: any) {
        this.id = nodeData.id;

        this.inc = nodeData.inc;
        this.dec = nodeData.dec;
        this.set = nodeData.set;
        this.reset = nodeData.reset;

        this.component = null;
    }

    abstract getNext(state: StateInfo, option: any): [string | null, number];
}

export interface INodeProps {
    state: StateInfo,
    progress: Function,
}
