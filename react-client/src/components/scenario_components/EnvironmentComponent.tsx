import React, {useState} from "react";
import {INodeProps} from "../../case-logic/graph-nodes/GraphNode";
import {emptyEnvironment, ScenarioEnvironmentApi} from "../../api/v1/ScenarioEnvironmentApi";
import {EnvironmentNode} from "../../case-logic/graph-nodes/EnvironmentNode";

export default function EnvironmentComponent(props: INodeProps) {
    let environmentId = (props.state.node as EnvironmentNode).environmentId;

    const [loaded, setLoaded] = useState(false);
    const [environment, setEnvironment] = useState(emptyEnvironment());

    if (!loaded) {
        ScenarioEnvironmentApi.findById(props.state.clientId, props.state.scenarioId, environmentId)
            .then((environment) => {
                setEnvironment(environment);
        });
        setLoaded(true);
    }

    if (loaded && (environment.id ?? 0) !== 0){
        props.state.setEnvironment(environment);
        props.progress();

    }


    return <div />;
}