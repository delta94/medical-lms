import {INode, REACT_FLOW_CHART} from "@mrblenny/react-flow-chart/src";
import React from "react";

export default function GraphSidebarItem(props: IGraphSidebarItemProps) {
    return (
        <div className="graph-sidebar-item"
             draggable={true}
             onDragStart={(e) => {
                 e.dataTransfer.setData(REACT_FLOW_CHART, JSON.stringify(props))
             }}>
            {props.children ?? (<h4>{props.label ?? props.type}</h4>)}
        </div>
    );
}

export interface IGraphSidebarItemProps {
    label?: string;
    type: string;
    ports: INode["ports"];
    properties?: any;
    children?: any;
}