import {Button} from "react-bootstrap";
import React, {useState} from "react";
import {SceneHeader} from "./SharedComponents";
import {INodeProps} from "../../case-logic/graph-nodes/GraphNode";
import {OutcomeNode} from "../../case-logic/graph-nodes/OutcomeNode";
import {useTranslation} from "react-i18next";
import {Redirect} from "react-router-dom";

export default function OutcomeComponent(props: INodeProps) {
    const [redirect, setRedirect] = useState(false);
    const {t} = useTranslation();

    let text: string = (props.state.node as OutcomeNode).text;

    if (redirect) {
        return <Redirect to={"/scenarios"}/>;
    }

    return (
        <div style={{float: "left"}}>
            <SceneHeader text={text}/>
            <Button onClick={() => {
                setRedirect(true);
            }}>{t("finish")}</Button>
        </div>
    );
}