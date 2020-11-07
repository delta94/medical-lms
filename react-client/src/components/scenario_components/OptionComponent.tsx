import {Button} from "react-bootstrap";
import React from "react";
import SceneTextbox from "./SharedComponents";
import {INodeProps} from "../../case-logic/graph-nodes/GraphNode";
import {OptionsNode} from "../../case-logic/graph-nodes/OptionNode";

export default function OptionsComponent(props: INodeProps) {
    let optionNode = props.state.node as OptionsNode;

    let text = props.state.flags.replaceFlagsWithValues(optionNode.text);

    return (
        <div>
            <SceneTextbox text={text}/>
            {optionNode.options.map((op, index) => {
                return (<Button
                    key={op.nextNode}
                    onClick={() => props.progress(index)}>
                    {props.state.flags.replaceFlagsWithValues(op.text)}
                </Button>)
            })}
        </div>
    );
}
