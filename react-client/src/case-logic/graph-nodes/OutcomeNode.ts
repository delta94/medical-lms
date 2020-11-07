import {GraphNode, StateInfo} from "./GraphNode";
import OutcomeComponent from "../../components/scenario_components/OutcomeComponent";

export class OutcomeNode extends GraphNode {
    text: string;

    constructor(nodeData: any) {
        super(nodeData);


        this.text = nodeData.text;

        this.component = OutcomeComponent;
    }

    getNext(state: StateInfo, option: any) : [null, number]{
        return [null, 0];
    }
}