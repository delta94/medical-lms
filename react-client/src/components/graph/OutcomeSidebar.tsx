import {Form, FormCheck, FormGroup} from "react-bootstrap";
import React from "react";
import {useTranslation} from "react-i18next";
import {IChart, INode} from "@mrblenny/react-flow-chart/src";

export default function OutcomeSidebar({graph, selectedNode, rerender}: IOptionSidebarProps) {
    const {t} = useTranslation();

    if (selectedNode === undefined || selectedNode === null) {
        return <div/>;
    }

    const port = Object.values(selectedNode.ports)[0];

    if (port === undefined) {
        return <div/>;
    }

    if (port.properties?.isOptimal === undefined) {
        port.properties = {
            isOptimal: false,
            isNegative: false
        }
    }


    return (
        <div className="graph-sidebar-contents">
            <Form>
                <FormGroup>
                    <FormCheck value="true" checked={port.properties.isOptimal} onChange={e => {
                        port.properties.isOptimal = e.target.checked;
                        port.properties.isNegative = false;
                        rerender();
                    }} type="checkbox" label={t("is-optimal")} />
                    <FormCheck value="true" checked={port.properties.isNegative} onChange={e => {
                        port.properties.isNegative = e.target.checked;
                        port.properties.isOptimal = false;
                        rerender();
                    }} type="checkbox" label={t("is-negative")} />
                </FormGroup>
            </Form>
        </div>
    );
}

export interface IOptionSidebarProps {
    graph: IChart;
    selectedNode: INode | null | undefined;
    rerender: Function;
}