import React from "react";
import {useTranslation} from "react-i18next";
import {INode} from "@mrblenny/react-flow-chart/src";

export function PhysicalExamNodeInner(node: INode): JSX.Element {
    const {t} = useTranslation();

    if (node.properties === undefined) {
        node.properties = { }
    }

    if (node.type === "exam-result") node.type = "physical-exam";

    return (
        <div className="node-inner">
            <h5>{t("physical-exam-node")}</h5>
        </div>
    );
}