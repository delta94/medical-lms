import {Guid} from "guid-typescript";
import {INode} from "@mrblenny/react-flow-chart/src";

const inputOutputPorts = (): INode["ports"] => {
    let outputId = Guid.create().toString();
    let inputId = Guid.create().toString();

    return {
        [inputId]: {
            id: inputId,
            type: "input"
        },
        [outputId]: {
            id: outputId,
            type: "output"
        }
    }
}

const inputPort = (): INode["ports"] => {
    let inputId = Guid.create().toString();

    return {
        [inputId]: {
            id: inputId,
            type: "input"
        }
    }
}

export const dialogueNodePorts = inputOutputPorts;

export const optionNodePorts = inputPort;

export const conditionalNodePorts = (): INode["ports"] => {
    let inputId = Guid.create().toString();
    let trueId = Guid.create().toString();
    let falseId = Guid.create().toString();

    return {
        [inputId]: {
            id: inputId,
            type: "input"
        },
        [trueId]: {
            id: trueId,
            type: "output",
            properties: {
                isTrue: true,
                linkColor: "green"
            }
        },
        [falseId]: {
            id: falseId,
            type: "output",
            properties: {
                isFalse: true,
                linkColor: "red"
            }
        }
    }
};

export const changeFlagNodePorts = inputOutputPorts;

export const environmentNodePorts = inputOutputPorts;

export const outcomeNodePorts = (): INode["ports"] => {
    let inputId = Guid.create().toString();

    return {
        [inputId]: {
            id: inputId,
            type: "input",
            properties: {
                isOptimal: false,
                isNegative: false
            }
        }
    }
}

export const patientInfoNodePorts = inputOutputPorts;

export const physicalExamNodePorts = inputOutputPorts;

export const clerkingInfoNodePorts = inputOutputPorts;

export const bloodTestsNodePorts = inputOutputPorts;

export const arterialBloodGasNodePorts = inputOutputPorts;