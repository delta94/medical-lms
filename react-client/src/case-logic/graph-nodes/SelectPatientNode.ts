import {GraphNode, StateInfo} from "./GraphNode";
import {SelectPatientComponent} from "../../components/scenario_components/SelectPatientComponent";

export class SelectPatientNode extends GraphNode {
    nextNode: string;

    constructor(nodeData: any) {
        super(nodeData);

        this.component = SelectPatientComponent;
        this.nextNode = nodeData.nextNode;
    }

    getNext(state: StateInfo, option: any) : [string, any]{
        return [this.nextNode, undefined];
    }
}