import React from "react";
import {INodeProps} from "../../case-logic/graph-nodes/GraphNode";

export default function ConditionalComponent(props: INodeProps) {
    props.progress(0);

    return (
        <div>
        </div>
    );
}