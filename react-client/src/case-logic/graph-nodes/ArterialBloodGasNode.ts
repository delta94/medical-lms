import {GraphNode, StateInfo} from "./GraphNode";
import ArterialBloodGasResultsComponent from "../../components/scenario_components/ArterialBloodGasResultsComponent";

export class ArterialBloodGasNode extends GraphNode {
    nextNode: string;

    constructor(nodeData: any) {
        super(nodeData);

        this.component = ArterialBloodGasResultsComponent;
        this.nextNode = nodeData.nextNode;
    }

    getNext(state: StateInfo, option: any): [string, number] {
        return [this.nextNode, 0];
    }
}