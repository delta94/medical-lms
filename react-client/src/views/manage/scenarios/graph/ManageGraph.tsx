import React, {useState} from "react";
import {IChart, IConfig} from "@mrblenny/react-flow-chart/src";
import GraphSidebarItem from "../../../../components/graph/GraphSidebarItem";
import {Button, Nav, Tab} from "react-bootstrap";
import ManagedFlowChart from "../../../../components/graph/ManagedFlowChart";
import {INode} from "@mrblenny/react-flow-chart/src/types/chart";
import {useTranslation} from "react-i18next";
import Icon from "../../../../components/Icon";
import {Redirect} from "react-router-dom";
import {ScenarioGraphApi} from "../../../../api/v1/ScenarioGraphApi";
import OptionSidebar from "../../../../components/graph/OptionSidebar";
import OutcomeSidebar from "../../../../components/graph/OutcomeSidebar";
import {CustomNodeInner, CustomPort} from "./CustomGraphElements";
import {
    arterialBloodGasNodePorts,
    changeFlagNodePorts,
    clerkingInfoNodePorts,
    conditionalNodePorts,
    dialogueNodePorts,
    environmentNodePorts,
    optionNodePorts,
    outcomeNodePorts,
    patientInfoNodePorts,
    physicalExamNodePorts
} from "./NodeItemPorts";
import ConditionalSidebar from "../../../../components/graph/ConditionalSidebar";
import ChangeFlagSidebar from "../../../../components/graph/ChangeFlagSidebar";
import EnvironmentSidebar from "../../../../components/graph/EnvironmentSidebar";

const initialChart: IChart = {
    offset: {x: 0, y: 0},
    nodes: {
        start: {
            id: "start",
            type: "start",
            position: {
                x: 20,
                y: 30
            },
            ports: {
                output: {
                    id: "output",
                    type: "output"
                }
            },
            properties: {
                isStart: true
            }
        }
    },
    links: {},
    selected: {},
    hovered: {},
    scale: 1
}

export default function ManageGraph(props: IManageGraphProps) {
    const [chart, setChart] = useState<IChart>(initialChart);
    const [loaded, setLoaded] = useState(false);
    const [close, setClose] = useState(false);

    const {t} = useTranslation();

    if (!loaded && props.clientId !== 0) {
        ScenarioGraphApi.get(props.clientId, props.scenarioId)
            .then(graph => {
                chart.nodes = graph.nodes;
                chart.links = graph.links;
                setLoaded(true);
            })
            .catch(_ => {
                setLoaded(true);
            });

        return <div/>
    }

    const config: IConfig = {
        smartRouting: false,
        validateLink: (p) => {
            let invalid = p.fromNodeId === p.toNodeId;
            return !invalid;
        }
    }

    function selectedNode(): INode | null | undefined {
        return chart.nodes[chart.selected.id ?? ""];
    }

    function rerender() {
        /*
            DO NOT REMOVE THIS, It's needed to force a rerender
         */
        setChart(prevChart => ({
            prevChart,
            ...chart
        }));
    }

    function save(close: boolean) {
        return ScenarioGraphApi.set(props.clientId, props.scenarioId, chart)
            .then(successResult => {
                if (successResult.success && close) {
                    setClose(true);
                }
            });
    }

    if (close) {
        return <Redirect to={`/manage/scenarios/${props.scenarioId}`}/>;
    }

    const saveButtons: JSX.Element = (
        <div className="graph-sidebar-message mt-auto">
            <Button className="d-inline-flex" onClick={() => save(false)}><Icon
                className="mr-1">save</Icon> {t("save")}</Button>
            <Button className="d-inline-flex float-right" onClick={() => save(true)}><Icon
                className="mr-1">save</Icon> {t("save-and-close")}</Button>
        </div>
    );

    let sidebarMessage = t("drag-drop-items");

    let sidebarContent = (
        <Tab.Container defaultActiveKey="general">
            <Nav variant="tabs">
                <Nav.Item>
                    <Nav.Link eventKey="general">{t("general")}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="medical">{t("medical")}</Nav.Link>
                </Nav.Item>
            </Nav>
            <Tab.Content>
                <Tab.Pane eventKey="general">
                    <GraphSidebarItem label={t("dialogue-node").toString()} type="text" ports={dialogueNodePorts()}
                                      properties={{scenarioId: props.scenarioId}}/>
                    <GraphSidebarItem label={t("option-node").toString()} type="option" ports={optionNodePorts()}/>
                    <GraphSidebarItem label={t("conditional-node").toString()} type="conditional"
                                      ports={conditionalNodePorts()}/>
                    <GraphSidebarItem label={t("change-flag-node").toString()} type="change-flag"
                                      ports={changeFlagNodePorts()}/>
                    <GraphSidebarItem label={t("environment-node").toString()} type="environment"
                                      ports={environmentNodePorts()} properties={{scenarioId: props.scenarioId}}/>
                    <GraphSidebarItem label={t("outcome-node").toString()} type="outcome" ports={outcomeNodePorts()}/>
                </Tab.Pane>
                <Tab.Pane eventKey="medical">
                    <GraphSidebarItem label={t("patient-info-node").toString()} type="patient-info"
                                      ports={patientInfoNodePorts()}/>
                    <GraphSidebarItem label={t("clerking-info-node").toString()} type="clerking-info"
                                      ports={clerkingInfoNodePorts()}/>
                    <GraphSidebarItem label={t("physical-exam-node").toString()} type="physical-exam"
                                      ports={physicalExamNodePorts()}/>
                    {/*<GraphSidebarItem label={t("blood-tests-node").toString()} type="blood-tests"*/}
                    {/*                  ports={bloodTestsNodePorts()}/>*/}
                    <GraphSidebarItem label={t("arterial-blood-gas-node").toString()} type="arterial-blood-gas"
                                      ports={arterialBloodGasNodePorts()}/>
                </Tab.Pane>
            </Tab.Content>
        </Tab.Container>
    );

    if (chart.selected.type === "node") {
        sidebarMessage = t("settings");
        if (selectedNode()?.type === "option") {
            sidebarContent = <OptionSidebar graph={chart} rerender={rerender} selectedNode={selectedNode()}/>;
        } else if (selectedNode()?.type === "conditional") {
            sidebarContent = <ConditionalSidebar graph={chart} rerender={rerender} selectedNode={selectedNode()}/>;
        } else if (selectedNode()?.type === "change-flag") {
            sidebarContent = <ChangeFlagSidebar graph={chart} rerender={rerender} selectedNode={selectedNode()}/>;
        } else if (selectedNode()?.type === "environment") {
            sidebarContent = <EnvironmentSidebar clientId={props.clientId} scenarioId={props.scenarioId} graph={chart} rerender={rerender} selectedNode={selectedNode()}/>;
        } else if (selectedNode()?.type === "outcome") {
            sidebarContent = <OutcomeSidebar graph={chart} rerender={rerender} selectedNode={selectedNode()}/>;
        }
    }

    let sidebar: JSX.Element = (
        <div className="graph-sidebar">
            <div className="graph-sidebar-message">
                {sidebarMessage}
            </div>
            {sidebarContent}
            {saveButtons}
        </div>
    );


    return (
        <div className="fullscreen-content graph-page">
            <div className="graph">
                <ManagedFlowChart onChartUpdate={setChart} config={config} chart={chart} components={{
                    NodeInner: CustomNodeInner,
                    Port: CustomPort
                }}/>
            </div>
            {sidebar}
        </div>
    );
}

export interface IManageGraphProps {
    clientId: number;
    scenarioId: number;
}

export function stopPropagation(e) {
    e.stopPropagation();
}
