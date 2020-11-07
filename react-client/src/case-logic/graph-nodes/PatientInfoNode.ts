import {GraphNode, StateInfo} from "./GraphNode";
import PatientInfoComponent from "../../components/scenario_components/PatientInfoComponent";


export class PatientInfoNode extends GraphNode {
    nextNode: string;

    constructor(nodeData: any) {
        super(nodeData);

        this.component = PatientInfoComponent;

        this.nextNode = nodeData.nextNode;
    }

    getNext(state: StateInfo, option: any): [string, number] {
        return [this.nextNode, 0];
    }
}