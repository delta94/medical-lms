import {GraphNode, StateInfo} from "./GraphNode";
import TextComponent from "../../components/scenario_components/TextComponent";

export class CaseText {
    speaker: string | undefined;
    text: string;
    speakerId: number | undefined;

    constructor(text: string, speaker: string | undefined = undefined, speakerId: number | undefined = undefined) {
        this.text = text;
        this.speaker = speaker;
        this.speakerId = speakerId;
    }
}

export class TextNode extends GraphNode {
    texts: CaseText[];
    nextNode: string;

    constructor(nodeData: any) {
        super(nodeData);
        this.texts = [];
        if (nodeData.texts) this.texts = nodeData.texts;
        if (nodeData.text) this.texts.push(new CaseText(nodeData.text));

        this.component = TextComponent;

        this.nextNode = nodeData.nextNode;
    }

    getNext(state: StateInfo, option: any) : [string, any]{
        let step : number = Number(state.step);
        if(isNaN(step)) step = 0;

        step++;
        if (this.texts.length <= step) {
            return [this.nextNode, undefined];
        }else{
            return [this.id, step];
    }
    }
}
