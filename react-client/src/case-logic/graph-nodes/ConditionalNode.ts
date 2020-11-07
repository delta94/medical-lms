import {GraphNode, StateInfo} from "./GraphNode";
import CaseFlags from "../CaseFlags";
import ConditionalComponent from "../../components/scenario_components/ConditionalComponent";

export enum ConditionalOperators {
    Equals = "==",
    NotEquals = "!=",
    LessThan = "<",
    LessThanOrEquals = "<=",
    GreaterThan = ">",
    GreaterThanOrEquals = ">=",
    TripleEquals = "===",
    NotTripleEquals = "!=="
}

class Condition {
    name: string;
    comparison: ConditionalOperators;
    value: string | number | boolean | null;

    constructor(name: string, comparison: ConditionalOperators, value: string | number | boolean | null) {
        this.name = name;
        this.comparison = comparison;
        this.value = value;
    }
}

export class ConditionalNode extends GraphNode {
    condition: Condition;
    nextNodeIfTrue: string;
    nextNodeIfFalse: string;

    constructor(nodeData: any) {
        super(nodeData);
        this.component = ConditionalComponent;

        this.condition = nodeData.condition;
        this.nextNodeIfTrue = nodeData.nextNodeIfTrue;
        this.nextNodeIfFalse = nodeData.nextNodeIfFalse;
    }

    getNext(state: StateInfo, option: any): [string, any] {
        let nodeId: string = evaluateConditionalNode(state.flags, this);
        return [nodeId, undefined];
    }
}

function evaluateConditionalNode(flags: CaseFlags, node: ConditionalNode) {
    let compare = flags.get(node.condition.name);
    let value = node.condition.value;
    if (value && compare) {
        if (!isNaN(parseFloat(value.toString()))) {
            value = parseFloat(value.toString());
        }
        if (!isNaN(parseFloat(compare.toString()))) {
            value = parseFloat(compare.toString());
        }

        switch (node.condition.comparison) {
            case ConditionalOperators.Equals:
                // eslint-disable-next-line eqeqeq
                return compare == value ? node.nextNodeIfTrue : node.nextNodeIfFalse;
            case ConditionalOperators.NotEquals:
                // eslint-disable-next-line eqeqeq
                return compare != value ? node.nextNodeIfTrue : node.nextNodeIfFalse;
            case ConditionalOperators.LessThan:
                return compare < value ? node.nextNodeIfTrue : node.nextNodeIfFalse;
            case ConditionalOperators.GreaterThan:
                return compare > value ? node.nextNodeIfTrue : node.nextNodeIfFalse;
            case ConditionalOperators.LessThanOrEquals:
                return compare <= value ? node.nextNodeIfTrue : node.nextNodeIfFalse;
            case ConditionalOperators.GreaterThanOrEquals:
                return compare >= value ? node.nextNodeIfTrue : node.nextNodeIfFalse;
            case ConditionalOperators.TripleEquals:
                return compare === value ? node.nextNodeIfTrue : node.nextNodeIfFalse;
            case ConditionalOperators.NotTripleEquals:
                return compare !== value ? node.nextNodeIfTrue : node.nextNodeIfFalse;
        }
    }
    return node.nextNodeIfFalse;
}