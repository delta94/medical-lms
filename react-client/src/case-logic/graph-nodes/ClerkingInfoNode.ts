import {GraphNode, StateInfo} from "./GraphNode";
import ClerkingInfoComponent from "../../components/scenario_components/ClerkingInfoComponent";


export class ClerkingInfoNode extends GraphNode {
    nextNode: string;

    constructor(nodeData: any) {
        super(nodeData);

        this.component = ClerkingInfoComponent;

        this.nextNode = nodeData.nextNode;
    }

    getNext(state: StateInfo, option: any): [string, number] {
        if(option === "next") {
            return [this.nextNode, 0];
        }
        else{
            return [this.id, option];
        }
    }
}