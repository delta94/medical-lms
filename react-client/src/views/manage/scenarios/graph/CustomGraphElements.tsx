import {INodeInnerDefaultProps, IPortDefaultProps, NodeInnerDefault} from "@mrblenny/react-flow-chart/src";
import {useTranslation} from "react-i18next";
import {TextNodeInner} from "../../../../components/graph/TextNode";
import {OptionNodeInner} from "../../../../components/graph/OptionNode";
import {OutcomeNodeInner} from "../../../../components/graph/OutcomeNode";
import {PhysicalExamNodeInner} from "../../../../components/graph/PhysicalExamNode";
import If, {Else, Then} from "../../../../components/If";
import Icon from "../../../../components/Icon";
import React from "react";
import {ConditionalNodeInner} from "../../../../components/graph/ConditionalNode";
import {ChangeFlagNodeInner} from "../../../../components/graph/ChangeFlagNode";
import {EnvironmentNodeInner} from "../../../../components/graph/EnvironmentNode";

export function CustomNodeInner({node, config}: INodeInnerDefaultProps): JSX.Element {
    const {t} = useTranslation();

    switch (node.type) {
        case "start":
            return (
                <div className="node-inner text-center">
                    <h4>{t("start-node")}</h4>
                </div>
            );
        case "text":
            return TextNodeInner(node);
        case "option":
            return OptionNodeInner(node);
        case "conditional":
            return ConditionalNodeInner(node);
        case "change-flag":
            return ChangeFlagNodeInner(node);
        case "environment":
            return EnvironmentNodeInner(node);
        case "outcome":
            return OutcomeNodeInner(node);
        case "exam-result":
        case "physical-exam":
            return PhysicalExamNodeInner(node);
        case "patient-info":
            return (
                <div className="node-inner text-center">
                    <h4>{t("patient-info-node")}</h4>
                </div>
            );
        case "clerking-info":
            return (
                <div className="node-inner text-center">
                    <h4>{t("clerking-info-node")}</h4>
                </div>
            );
        case "blood-tests":
            return (
                <div className="node-inner text-center">
                    <h4>{t("blood-tests-node")}</h4>
                </div>
            );
        case "arterial-blood-gas":
            return (
                <div className="node-inner text-center">
                    <h4>{t("arterial-blood-gas-node")}</h4>
                </div>
            );
        default:
            return NodeInnerDefault({node, config});
    }
}

export function CustomPort(props: IPortDefaultProps): JSX.Element {
    let backgroundColour = "cornflowerBlue";
    if (props.port.properties?.isOptimal !== undefined) {
        backgroundColour = props.port.properties.isOptimal ? "#dbbc12": backgroundColour;
    }
    if (props.port.properties?.isNegative !== undefined) {
        backgroundColour = props.port.properties.isNegative ? "red": backgroundColour;
    }
    if (props.port.properties?.isTrue !== undefined) {
        backgroundColour = props.port.properties.isTrue ? "green": backgroundColour;
    }
    if (props.port.properties?.isFalse !== undefined) {
        backgroundColour = props.port.properties.isFalse ? "red": backgroundColour;
    }

    return (
        <div className="port" style={{background: backgroundColour}} title={props.port.properties?.text ?? ""}>
            <If conditional={props.port.properties?.isOptimal !== undefined || props.port.properties?.isNegative !== undefined
            || props.port.properties?.isTrue !== undefined  || props.port.properties?.isFalse !== undefined} hasElse={true}>
                <Then>
                    {props.port.properties?.isOptimal ?? false
                        ? <Icon>star</Icon>
                        : (
                            (props.port.properties?.isNegative ?? false) || (props.port.properties?.isFalse ?? false)
                                ? <Icon>close</Icon>
                                : (
                                    props.port.properties?.isTrue ?? false
                                    ? <Icon>check</Icon>
                                    : <Icon>keyboard_arrow_down</Icon>
                                )
                        )
                    }

                </Then>
                <Else>
                    <Icon>keyboard_arrow_down</Icon>
                </Else>
            </If>
        </div>
    );
}
