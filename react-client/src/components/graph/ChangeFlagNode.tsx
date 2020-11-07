import {INode} from "@mrblenny/react-flow-chart/src";
import {useTranslation} from "react-i18next";
import If, {Else, Then} from "../If";
import React from "react";

export function ChangeFlagNodeInner(node: INode): JSX.Element {
    const {t} = useTranslation();

    if (node.properties === undefined) {
        node.properties = {
            name: "",
            value: ""
        }
    }

    return (
        <div className="node-inner">
            <h5>{t("change-flag-node")}</h5>
            <If conditional={node.properties.name && (node.properties.value ?? "") !== ""} hasElse={true}>
                <Then>
                    <span>{node.properties.name} = {node.properties.value}</span>
                </Then>
                <Else>
                    <span style={{color: "red"}}>Not complete</span>
                </Else>
            </If>
        </div>
    );
}