import {Button, Form, FormCheck, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import If from "../If";
import {Guid} from "guid-typescript";
import React from "react";
import {useTranslation} from "react-i18next";
import {IChart, ILink, INode} from "@mrblenny/react-flow-chart/src";

export default function OptionSidebar({graph, selectedNode, rerender}: IOptionSidebarProps) {
    const {t} = useTranslation();

    return (
        <div className="graph-sidebar-contents">
            <Form>
                {Object.entries(selectedNode?.ports ?? {})
                    .filter(value => value[1].type === "output")
                    .map((value, index) => {
                        const port = value[1];
                        return (
                            <div key={port.id}>
                                <FormGroup>
                                    <FormLabel>{t("text")}</FormLabel>
                                    <FormControl name={port.id} type="text"
                                                 defaultValue={port.properties.text}
                                                 onChange={e => {
                                                     port.properties.text = e.target.value;
                                                     rerender();
                                                 }}/>
                                </FormGroup>
                                <FormGroup>
                                    <FormCheck value="true" checked={port.properties.isOptimal} onChange={e => {
                                        port.properties.isOptimal = e.target.checked;
                                        port.properties.isNegative = false;
                                        port.properties.linkColor = port.properties.isOptimal ? "#dbbc12" : "cornflowerblue";
                                        rerender();
                                    }} type="checkbox" label={t("is-optimal")} />
                                    <FormCheck value="true" checked={port.properties.isNegative} onChange={e => {
                                        port.properties.isNegative = e.target.checked;
                                        port.properties.isOptimal = false;
                                        port.properties.linkColor = port.properties.isNegative ? "red" : "cornflowerblue";
                                        rerender();
                                    }} type="checkbox" label={t("is-negative")} />
                                </FormGroup>
                                <If conditional={index !== 0}>
                                    <Button onClick={() => {
                                        if (selectedNode) {
                                            let links = Object.values(graph.links);
                                            let link: ILink | undefined = links.find(l => l.from.portId === port.id);
                                            if (link) {
                                                delete graph.links[link.id];
                                            }
                                            delete selectedNode.ports[port.id];
                                        }
                                        rerender();
                                    }}>{t("remove")}</Button>
                                </If>
                                <hr/>
                            </div>
                        );
                    })}

                <If conditional={Object.values(selectedNode?.ports ?? {}).filter(p => p.type === "output").length === 0}>
                    <div className="mb-4">
                        {t("no-options")}
                    </div>
                </If>

                <Button onClick={() => {
                    let id = Guid.create().toString();
                    if (selectedNode) {
                        selectedNode.ports[id] = {
                            id: id,
                            type: "output",
                            properties: {
                                text: "",
                                isOptimal: false,
                                isNegative: false
                            }
                        }
                        rerender();
                    }
                }}>{t("add")}</Button>
            </Form>
        </div>
    );
}

export interface IOptionSidebarProps {
    graph: IChart;
    selectedNode: INode | null | undefined;
    rerender: Function;
}