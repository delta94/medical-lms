import {GraphNode, StateInfo} from "./GraphNode";
import OptionComponent from "../../components/scenario_components/OptionComponent";

export class CaseOption {
    text: string;
    nextNode: string;

    public inc: string[] | undefined;
    public dec: string[] | undefined;
    public set: any | undefined;
    public reset: string[] | undefined;


    constructor(text: string, nextNode: string) {
        this.text = text;
        this.nextNode = nextNode;
    }
}

export class OptionsNode extends GraphNode {
    text: string;
    options: CaseOption[];

    constructor(nodeData: any) {
        super(nodeData);
        this.text = nodeData.text;
        this.options = nodeData.options;

        this.component = OptionComponent;
    }

    getNext(state: StateInfo, option: any) : [string, any]{
        let chosenOption : CaseOption = this.options[option];
        return [chosenOption.nextNode, undefined];
    }
}