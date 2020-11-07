import {Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import React from "react";
import {useTranslation} from "react-i18next";
import {IChart, INode} from "@mrblenny/react-flow-chart/src";
import {ConditionalOperators} from "../../case-logic/graph-nodes/ConditionalNode";

export default function ConditionalSidebar({graph, selectedNode, rerender}: IConditionalSidebarProps) {
    const {t} = useTranslation();

    return (
        <div className="graph-sidebar-contents">
            <Form>
                <FormGroup>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl type="text" defaultValue={selectedNode?.properties.name ?? ""}
                                 onChange={e => {
                                     selectedNode!!.properties.name = e.target.value;
                                     rerender();
                                 }}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("comparison")}</FormLabel>
                    <FormControl value={selectedNode?.properties.comparison ?? "=="} onChange={(e) => {
                        // @ts-ignore
                        selectedNode!!.properties.comparison = e.target.value;
                        rerender();
                    }} as="select">
                        <option value={ConditionalOperators.Equals}>{t("equals")}</option>
                        <option value={ConditionalOperators.NotEquals}>{t("not-equals")}</option>
                        <option value={ConditionalOperators.LessThan}>{t("less-than")}</option>
                        <option value={ConditionalOperators.LessThanOrEquals}>{t("less-than-equals")}</option>
                        <option value={ConditionalOperators.GreaterThan}>{t("greater-than")}</option>
                        <option value={ConditionalOperators.GreaterThanOrEquals}>{t("greater-than-equals")}</option>
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("value")}</FormLabel>
                    <FormControl type="value" defaultValue={selectedNode?.properties.value ?? ""}
                                 onChange={e => {
                                     selectedNode!!.properties.value = e.target.value;
                                     rerender();
                                 }}/>
                </FormGroup>
            </Form>
        </div>
    );
}

export interface IConditionalSidebarProps {
    graph: IChart;
    selectedNode: INode | null | undefined;
    rerender: Function;
}