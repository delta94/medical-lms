import {GraphNode, StateInfo} from "./GraphNode";
import CaseFlags from "../CaseFlags";
import {ConditionalOperators} from "./ConditionalNode";

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

export class ConditionalJump {
    node: string;
    condition: Condition;

    constructor(node: string, condition: Condition) {
        this.node = node;
        this.condition = condition;
    }
}

export class ComplexConditionalNode extends GraphNode {
    defaultNode: string;

    jumps: ConditionalJump[];

    constructor(nodeData: any) {
        super(nodeData);
        this.defaultNode = nodeData.defaultNode;
        this.jumps = nodeData.jumps;
    }

    getNext(state: StateInfo, option: any): [string, any] {
        let nodeId: string = evaluateConditionalNode(state.flags, this);
        return [nodeId, undefined];
    }
}

function evaluateConditionalNode(flags: CaseFlags, node: ComplexConditionalNode) {
    for (let jump of node.jumps.values()) {
        let compare = flags.get(jump.condition.name);
        let value = jump.condition.value;
        if (value && compare) {
            switch (jump.condition.comparison) {
                case ConditionalOperators.Equals:
                    // eslint-disable-next-line eqeqeq
                    if (value == compare)
                        return jump.node;
                    break;
                case ConditionalOperators.NotEquals:
                    // eslint-disable-next-line eqeqeq
                    if (value != compare)
                        return jump.node;
                    break;
                case ConditionalOperators.LessThan:
                    if (value < compare)
                        return jump.node;
                    break;
                case ConditionalOperators.GreaterThan:
                    if (value > compare)
                        return jump.node;
                    break;
                case ConditionalOperators.LessThanOrEquals:
                    if (value <= compare)
                        return jump.node;
                    break;
                case ConditionalOperators.GreaterThanOrEquals:
                    if (value >= compare)
                        return jump.node;
                    break;
                case ConditionalOperators.TripleEquals:
                    if (value === compare)
                        return jump.node;
                    break;
                case ConditionalOperators.NotTripleEquals:
                    if (value !== compare)
                        return jump.node;
                    break;
            }
        }
    }
    return node.defaultNode;
}