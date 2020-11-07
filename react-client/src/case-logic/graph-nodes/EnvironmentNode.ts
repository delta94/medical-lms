import {GraphNode, StateInfo} from "./GraphNode";
import EnvironmentComponent from "../../components/scenario_components/EnvironmentComponent";

export class EnvironmentNode extends GraphNode {
    environmentId: number;
    nextNode: string;

    constructor(nodeData: any) {
        super(nodeData);
        this.component = EnvironmentComponent;

        this.nextNode = nodeData.nextNode;
        this.environmentId = nodeData.environmentId;
    }

    getNext(state: StateInfo, option: any): [string, any] {
        return [this.nextNode, 0];
    }
}