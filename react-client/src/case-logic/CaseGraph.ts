import {OptionsNode} from "./graph-nodes/OptionNode";
import {GraphNode} from "./graph-nodes/GraphNode";
import {TextNode} from "./graph-nodes/TextNode";
import {NodeType} from "../api/v1/ScenarioGraphApi";
import {ExamResultNode} from "./graph-nodes/ExamResultNode";
import {PatientInfoNode} from "./graph-nodes/PatientInfoNode";
import {OutcomeNode} from "./graph-nodes/OutcomeNode";
import {ConditionalNode} from "./graph-nodes/ConditionalNode";
import {ArterialBloodGasNode} from "./graph-nodes/ArterialBloodGasNode";
import {ChangeFlagNode} from "./graph-nodes/ChangeFlagNode";
import {EnvironmentNode} from "./graph-nodes/EnvironmentNode";
import {ClerkingInfoNode} from "./graph-nodes/ClerkingInfoNode";

export class DirectedGraph {
    rootNode: any;
    nodes: Map<string, GraphNode>;

    constructor() {
        this.rootNode = null;
        this.nodes = new Map<string, GraphNode>();
    }

    initFromObject(data: any) {
        this.nodes = new Map<string, GraphNode>();
        this.rootNode = data.rootNode;

        for (let i in data.nodes) {
            let nodeData = data.nodes[i];
            let type = nodeTypes[nodeData.type];
            if (type) {
                let node = new type(nodeData);
                this.addNode(node);
            } else {
                console.warn(`Missing node type: ${nodeData.type}`);
            }
        }
    }

    addNode(node: GraphNode) {
        this.nodes.set(node.id, node);
    }

    getNodeById(id: string | null) {
        if (id === null) return null;
        return this.nodes.get(id) || null;
    }
}

const nodeTypes = {
    [NodeType.Text]: TextNode,
    [NodeType.Option]: OptionsNode,
    [NodeType.Environment]: EnvironmentNode,
    [NodeType.Conditional]: ConditionalNode,
    [NodeType.ChangeFlag]: ChangeFlagNode,
    [NodeType.Outcome]: OutcomeNode,
    [NodeType.PhysicalExam]: ExamResultNode,
    [NodeType.PatientInfo]: PatientInfoNode,
    [NodeType.ClerkingInfo]: ClerkingInfoNode,
    [NodeType.ArterialBloodGas]: ArterialBloodGasNode
};