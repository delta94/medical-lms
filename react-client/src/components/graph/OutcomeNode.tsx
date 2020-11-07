import React from "react";
import {Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {stopPropagation} from "../../views/manage/scenarios/graph/ManageGraph";
import {INode} from "@mrblenny/react-flow-chart/src";

export function OutcomeNodeInner(node: INode): JSX.Element {
    const {t} = useTranslation();

    if (node.properties === undefined) {
        node.properties = {
            text: ""
        }
    }

    let backgroundColour = "white";
    if (node.properties.isOptimal !== undefined) {
        backgroundColour = node.properties.isOptimal ? "#dbbc12": backgroundColour;
    }
    if (node.properties.isNegative !== undefined) {
        backgroundColour = node.properties.isNegative ? "red": backgroundColour;
    }

    return (
        <div className="node-inner" style={{backgroundColor: backgroundColour}}>
            <h5>{t("outcome-node")}</h5>
            <Form>
                <FormGroup>
                    <FormLabel>{t("text")}</FormLabel>
                    <FormControl type="text" defaultValue={node.properties.text} onChange={e => {
                        node.properties.text = e.target.value;
                    }}
                     onClick={stopPropagation}
                     onMouseUp={stopPropagation}
                     onMouseDown={stopPropagation}
                     onKeyDown={stopPropagation}/>
                </FormGroup>
            </Form>
        </div>
    );
}