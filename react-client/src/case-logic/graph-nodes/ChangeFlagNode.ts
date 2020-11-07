import {GraphNode, StateInfo} from "./GraphNode";
import ChangeFlagComponent from "../../components/scenario_components/ChangeFlagComponent";

export class ChangeFlagNode extends GraphNode {
    nextNode: string;
    name: string;
    value: string;

    constructor(nodeData: any) {
        super(nodeData);

        this.component = ChangeFlagComponent;
        this.nextNode = nodeData.nextNode;
        this.name = nodeData.name;
        this.value = nodeData.value;
    }

    getNext(state: StateInfo, option: any): [string, any] {
        if (isNaN(parseFloat(this.value))) {
            state.flags.set(this.name, this.value);
        } else {
            state.flags.set(this.name, parseFloat(this.value));
        }

        return [this.nextNode, 0];
    }
}