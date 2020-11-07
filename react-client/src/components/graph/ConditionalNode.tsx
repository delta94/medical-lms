import React from "react";
import {useTranslation} from "react-i18next";
import {INode} from "@mrblenny/react-flow-chart/src";
import If, {Else, Then} from "../If";

export function ConditionalNodeInner(node: INode): JSX.Element {
    const {t} = useTranslation();

    if (node.properties === undefined) {
        node.properties = {
            comparison: "=="
        }
    }

    return (
        <div className="node-inner">
            <h5>{t("conditional-node")}</h5>
            <If conditional={node.properties.name && (node.properties.value ?? "") !== ""} hasElse={true}>
                <Then>
                    <span>{node.properties.name} {node.properties.comparison} {node.properties.value}</span>
                </Then>
                <Else>
                    <span style={{color: "red"}}>Condition not complete</span>
                </Else>
            </If>
        </div>
    );
}