import {INode} from "@mrblenny/react-flow-chart/src";
import {useTranslation} from "react-i18next";
import If, {Else, Then} from "../If";
import React, {useState} from "react";
import {emptyEnvironment, Environment, ScenarioEnvironmentApi} from "../../api/v1/ScenarioEnvironmentApi";
import {useGlobalState} from "../../state/GlobalState";
import Alert from "react-bootstrap/Alert";

export function EnvironmentNodeInner(node: INode): JSX.Element {
    const [globalState] = useGlobalState();
    const [env, setEnv] = useState<Environment>(emptyEnvironment());

    const {t} = useTranslation();

    if (node.properties.environmentId === undefined) {
        node.properties.environmentId = 0;
    }

    if (env.scenarioId === 0 && node.properties.scenarioId !== 0 && node.properties.environmentId !== 0) {
        ScenarioEnvironmentApi.findById(globalState.client.id, node.properties.scenarioId, node.properties.environmentId)
            .then(environment => {
                setEnv(environment);
            });
    }

    return (
        <div className="node-inner">
            <h5>{t("environment-node")}</h5>
            <If conditional={node.properties.environmentId !== 0} hasElse={true}>
                <Then>
                    {env.name}
                </Then>
                <Else>
                    <Alert variant="danger">No environment set</Alert>
                </Else>
            </If>
        </div>
    );
}