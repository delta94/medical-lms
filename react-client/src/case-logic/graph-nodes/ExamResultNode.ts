import {GraphNode, StateInfo} from "./GraphNode";
import ExamResultComponent from "../../components/scenario_components/ExamResultComponent";

export class ExamResultNode extends GraphNode {
    nextNode: string;

    constructor(nodeData: any) {
        super(nodeData);

        this.component = ExamResultComponent;
        this.nextNode = nodeData.nextNode;
    }

    getNext(state: StateInfo, option: any) : [string, any]{

        if(state.step){
            return [this.id, undefined];

        }else{

            if(option === "next"){
                return [this.nextNode, undefined];
            }else{
                return [this.id, option];
            }


        }
    }
}