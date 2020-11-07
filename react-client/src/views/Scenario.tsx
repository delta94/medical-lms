import React, {useState} from 'react';
import {DirectedGraph} from "../case-logic/CaseGraph";
import {GraphNode, StateInfo} from "../case-logic/graph-nodes/GraphNode";
import CaseFlags from "../case-logic/CaseFlags";
import {Patient} from "../api/v1/PatientApi";
import {ScenarioGraphApi} from "../api/v1/ScenarioGraphApi";
import EmptyComponent from "../components/scenario_components/EmptyComponent";
import {emptyEnvironment, Environment} from "../api/v1/ScenarioEnvironmentApi";
import ScenarioEnvironment from "../components/scenario_components/ScenarioEnvironment";
import {emptyScenarioBaseAttempt, ScenarioBaseAttempt, ScenarioDecisionApi} from "../api/v1/ScenarioDecisionsApi";
import {SelectPatientNode} from "../case-logic/graph-nodes/SelectPatientNode";

export default function Scenario(props: IScenarioProps) {
    const [loaded, setLoaded] = useState(false);

    const [scenarioGraph] = useState<DirectedGraph>(new DirectedGraph());
    const [patients] = useState<Array<Patient>>([]);

    const [node, setNode] = useState<GraphNode | null>(null);
    const [step, setStep] = useState<any>(undefined);
    const [flags] = useState<CaseFlags>(new CaseFlags());
    const [environment, setEnvironment] = useState<Environment>(emptyEnvironment());

    const [scenarioInitialised, setScenarioInitialised] = useState(false);
    const [attemptInitialised, setAttemptInitialised] = useState(false);

    const [attempt, setAttempt] = useState<ScenarioBaseAttempt>(emptyScenarioBaseAttempt());
    const [decisions] = useState<Array<any>>([])

    function initialiseScenario(json: string) {
        scenarioGraph.initFromObject(json);

        // This sets the start node to a select patient node, and points that to the start node from the json
        // it's just kind of a bodge to get it working without having to change the graph or db code

        // All code referring to the patient or patientId has been replaced with patients[0]
        // This ends up working exactly the same way as before except now it should be easier to add multiple patients
        // in future
        let startNode = new SelectPatientNode({nextNode: scenarioGraph.rootNode});
        //setNode(scenarioGraph.getNodeById(scenarioGraph.rootNode));
        setNode(startNode);
        setScenarioInitialised(true);
    }

    function initialiseAttempt(attempt: ScenarioBaseAttempt) {
        setAttempt(attempt);
        setAttemptInitialised(true);
    }

    function newDecision(attempt: ScenarioBaseAttempt, decision: any) {
        ScenarioDecisionApi.createDecision(props.clientId, props.scenarioId,
            {attemptId: attempt.attemptId, step: decisions.length, decision: {decision}});
        decisions.push(decision);
    }

    function addPatient(patient: Patient){
        patients.push(patient);
    }

    function finishScenario() {
        attempt.completed = true;
        attempt.timeFinished = new Date();
        ScenarioDecisionApi.updateAttempt(props.clientId, props.scenarioId, attempt).then(finishedAttempt => {
            console.info("Attempt completed", finishedAttempt);
        });
    }

    function progressState(option: any) {
        do {
            newDecision(attempt, option);
            if (node === null) return;
            let [nextNode, nextStep] = node.getNext(getStateInfo(), option);

            setStep(nextStep);
            setNode(scenarioGraph.getNodeById(nextNode));

            if (nextNode === null) {
                finishScenario();
                return;
            }

            if (step === undefined) {
                flags.update(node);
            }
            option = null;
        } while (node && !node.component);
    }

    function getStateInfo(): StateInfo {
        return {
            clientId: props.clientId,
            scenarioId: props.scenarioId,

            node: node,
            step: step,
            flags: flags,
            patients: patients,
            environment: environment,

            addPatient: addPatient,
            setEnvironment: setEnvironment
        }
    }

    if (!loaded && props.clientId && props.scenarioId) {
        setLoaded(true);
        // Load script
        ScenarioGraphApi.findNodeArray(props.clientId, props.scenarioId)
            .then(scenario => {
                initialiseScenario(scenario);
            });

        ScenarioDecisionApi.createAttempt(props.clientId, props.scenarioId)
            .then(attempt => {
                initialiseAttempt(attempt);
            });
    }

    function isInitialised() {
        return loaded && scenarioInitialised && attemptInitialised;
    }

    if (isInitialised()) {
        if (node && node.component) {
            let Component = node.component;
            return (
                <ScenarioEnvironment environment={environment}>
                    <Component state={getStateInfo()} progress={progressState} />
                </ScenarioEnvironment>
            );
        }
    }
    return (<EmptyComponent/>);
}

export interface IScenarioProps {
    clientId: number;
    scenarioId: number;
}
