import {
    actions,
    FlowChart,
    IChart, IConfig,
    IOnDragCanvasInput,
    IOnDragCanvasStopInput,
    IOnDragNodeStopInput
} from "@mrblenny/react-flow-chart/src";
import mapValues from "@mrblenny/react-flow-chart/src/container/utils/mapValues";
import React from "react";
import {IFlowChartCallbacks, IFlowChartComponents} from "@mrblenny/react-flow-chart/src/components/FlowChart/FlowChart";
import {
    ILinkBaseInput,
    INodeBaseInput,
    IOnCanvasDropInput,
    IOnDragNodeInput,
    IOnLinkBaseEvent,
    IOnLinkCompleteInput,
    IOnLinkMoveInput,
    IOnNodeSizeChangeInput,
    IOnPortPositionChangeInput
} from "@mrblenny/react-flow-chart/src/types/functions";

export default class ManagedFlowChart extends React.Component<IManageFlowChartProps, IChart> {
    public state: IChart

    //Based on https://github.com/MrBlenny/react-flow-chart/blob/master/src/container/FlowChartWithState.tsx
    private stateActions: typeof actions = mapValues<typeof actions, any>(actions, (func: Function) =>
        (...args: any) => {
            this.setState(func(...args), () => {
                this.props.onChartUpdate?.(this.state);
            });
        }) as typeof actions;


    constructor(props: IManageFlowChartProps) {
        super(props);
        this.state = props.chart;
    }

    actions: IFlowChartCallbacks = {
        onDragNode: (input: IOnDragNodeInput) => {
            this.stateActions.onDragNode(input);
        },
        onDragNodeStop: (input: IOnDragNodeStopInput) => {
            this.stateActions.onDragNodeStop(input);
        },
        onDragCanvas: (input: IOnDragCanvasInput) => {
            this.stateActions.onDragCanvas(input);
        },
        onDragCanvasStop: (input: IOnDragCanvasStopInput) => {
            this.stateActions.onDragCanvasStop(input);
        },
        onLinkStart: (input: IOnLinkBaseEvent) => {
            this.stateActions.onLinkStart(input);
        },
        onLinkMove: (input: IOnLinkMoveInput) => {
            this.stateActions.onLinkMove(input);
        },
        onLinkComplete: (input: IOnLinkCompleteInput) => {
            this.stateActions.onLinkComplete(input);
        },
        onLinkCancel: (input: IOnLinkBaseEvent) => {
            this.stateActions.onLinkCancel(input);
        },
        onLinkMouseEnter: (input: ILinkBaseInput) => {
            this.stateActions.onLinkMouseEnter(input);
        },
        onLinkMouseLeave: (input: ILinkBaseInput) => {
            this.stateActions.onLinkMouseLeave(input);
        },
        onLinkClick: (input: ILinkBaseInput) => {
            this.stateActions.onLinkClick(input);
        },
        onCanvasClick: (input: any) => {
            this.stateActions.onCanvasClick(input);
        },
        onNodeMouseEnter: (input: INodeBaseInput) => {
            this.stateActions.onNodeMouseEnter(input);
        },
        onNodeMouseLeave: (input: INodeBaseInput) => {
            this.stateActions.onNodeMouseLeave(input);
        },
        onDeleteKey: (input: any) => {
            let selected = this.state.selected;
            let isStart = false;
            if (selected && selected.type === "node" && this.state.nodes[selected.id!!].type === "start")
                isStart = true;
            if (!isStart) this.stateActions.onDeleteKey(input);
        },
        onNodeClick: (input: INodeBaseInput) => {
            this.stateActions.onNodeClick(input);
        },
        onNodeDoubleClick: (input: INodeBaseInput) => {
            this.stateActions.onNodeDoubleClick(input);
        },
        onNodeSizeChange: (input: IOnNodeSizeChangeInput) => {
            this.stateActions.onNodeSizeChange(input);
        },
        onPortPositionChange: (input: IOnPortPositionChangeInput) => {
            this.stateActions.onPortPositionChange(input);
        },
        onCanvasDrop: (input: IOnCanvasDropInput) => {
            this.stateActions.onCanvasDrop(input);
        },
        onZoomCanvas: (input: { config?: IConfig; data: any; }) => {
            this.stateActions.onZoomCanvas(input);
        }
    };

    public render() {
        return (
            <FlowChart chart={this.state} config={this.props.config} callbacks={this.actions} Components={this.props.components}/>
        );
    }
}

export interface IManageFlowChartProps {
    chart: IChart;
    components?: IFlowChartComponents;
    onChartUpdate?: Function;
    config?: IConfig;
}