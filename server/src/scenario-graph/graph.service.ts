import {BadRequestException, Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Role} from "@/user/user.entity";
import {GraphRepository} from "./graph.repository";
import {NodeType, ScenarioNode} from "./node.entity";
import {IGraph, ILink, INode, IPort} from "@/scenario-graph/types";
import {from} from "rxjs";

interface IProcessedLink {
    id: string;
    from: {
        id: string;
        type: string;
        properties?: any;
        port: IPort;
    },
    to: {
        id: string;
        type: string;
        properties?: any;
        port: IPort;
    }
}

@Injectable({scope: Scope.REQUEST})
export class GraphService {
    constructor(
        private readonly graphRepository: GraphRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async findAsNodeArray(clientId: number, scenarioId: number): Promise<ScenarioNode[]> {
        this.authoriseRead(clientId);

        let graph = await this.graphRepository.getActive(clientId, scenarioId);
        if (graph === null)
            return [];
        const nodes: ScenarioNode[] = [];

        let nodeArray: INode[] = Object.values(graph.nodes);
        let links: ILink[] = Object.values(graph.links);

        nodeArray.forEach(n => {
            let node: ScenarioNode = null;
            let nodeFromLinks = links.filter(l => l.from.nodeId === n.id);
            let nodeToLinks = links.filter(l => l.to.nodeId === n.id);

            let outgoingNodeLinks: IProcessedLink[] = [];
            let incomingNodeLinks: IProcessedLink[] = [];

            //The code below is for reorganising links so that they're always from an input to an output.
            nodeFromLinks.forEach(value => {
                let toNode = nodeArray.find(n => n.id === value.to.nodeId);
                let fromPort = n.ports[value.from.portId];
                let toPort = toNode.ports[value.to.portId];

                if (fromPort.type === "input" && toPort.type === "output") {
                    //This is too prevent the accidental leakage of which options are correct to students
                    if (toPort.properties?.isOptimal) {
                        delete toPort.properties.isOptimal;
                        delete toPort.properties.isNegative;
                    }
                    incomingNodeLinks.push(GraphService.getLink(value.id, toNode, toPort, n, fromPort));
                } else if (fromPort.type === "output" && toPort.type === "input") {
                    if (fromPort.properties?.isOptimal) {
                        delete fromPort.properties.isOptimal;
                        delete fromPort.properties.isNegative;
                    }
                    outgoingNodeLinks.push(GraphService.getLink(value.id, n, fromPort, toNode, toPort))
                }
            });

            function removeScoringData(fromPort: IPort, toPort: IPort) {
                if (fromPort.properties?.isOptimal) {
                    delete fromPort.properties.isOptimal;
                    delete fromPort.properties.isNegative;
                }
                if (toPort.properties?.isOptimal) {
                    delete toPort.properties.isOptimal;
                    delete toPort.properties.isNegative;
                }
            }

            nodeToLinks.forEach(value => {
                let fromNode = nodeArray.find(n => n.id === value.from.nodeId);
                let fromPort = fromNode.ports[value.from.portId];
                let toPort = n.ports[value.to.portId];

                if (fromPort.type === "input" && toPort.type === "output") {
                    removeScoringData(fromPort, toPort);
                    outgoingNodeLinks.push(GraphService.getLink(value.id, n, toPort, fromNode, fromPort));
                } else if (fromPort.type === "output" && toPort.type === "input") {
                    removeScoringData(fromPort, toPort);
                    incomingNodeLinks.push(GraphService.getLink(value.id, fromNode, fromPort, n, toPort));
                }
            });

            /*
            * IMPORTANT DO NOT access isOptimal and isNegative of ports in the below code
            */
            if (n.type === "start") {
                if (outgoingNodeLinks.length !== 1)
                    throw new BadRequestException("Start node must have one link");

                let link = outgoingNodeLinks[0];

                node = {
                    slug: n.id,
                    type: NodeType.Start,
                    data: {
                        nextNode: link.to.id
                    }
                }
            } else if (n.type === "conditional") {
                let nextNodeIfTrue = outgoingNodeLinks.find(l => l.from.port.properties.isTrue === true).to.id;
                let nextNodeIfFalse = outgoingNodeLinks.find(l => l.from.port.properties.isFalse === true).to.id;

                node = {
                    slug: n.id,
                    type: NodeType.Conditional,
                    data: {
                        condition: {
                            name: n.properties.name,
                            comparison: n.properties.comparison,
                            value: n.properties.value
                        },
                        nextNodeIfTrue: nextNodeIfTrue,
                        nextNodeIfFalse: nextNodeIfFalse
                    }
                }
            } else if (n.type === "change-flag") {
                if (outgoingNodeLinks.length !== 1)
                    throw new BadRequestException("Text node must have one link from it.");
                if (incomingNodeLinks.length < 1)
                    throw new BadRequestException("Text node must have at least one link to it.");

                let link = outgoingNodeLinks[0];

                node = {
                    slug: n.id,
                    type: NodeType.ChangeFlag,
                    data: {
                        nextNode: link.to.id,
                        name: n.properties.name,
                        value: n.properties.value,
                    }
                }
            } else if (n.type === "outcome") {
                node = {
                    slug: n.id,
                    type: NodeType.Outcome,
                    data: {
                        text: n.properties.text
                    }
                }
            } else if (n.type === "text") {
                if (outgoingNodeLinks.length !== 1)
                    throw new BadRequestException("Text node must have one link from it.");
                if (incomingNodeLinks.length < 1)
                    throw new BadRequestException("Text node must have at least one link to it.");

                let link = outgoingNodeLinks[0];

                node = {
                    slug: n.id,
                    type: NodeType.Text,
                    data: {
                        nextNode: link.to.id,
                        texts: n.properties.texts
                    }
                }
            } else if (n.type === "clerking-info") {
                if (outgoingNodeLinks.length !== 1)
                    throw new BadRequestException("Clerking info node must have one link from it.");
                if (incomingNodeLinks.length < 1)
                    throw new BadRequestException("Clerking info node must have at least one link to it.");

                let link = outgoingNodeLinks[0];

                node = {
                    slug: n.id,
                    type: NodeType.ClerkingInfo,
                    data: {
                        nextNode: link.to.id
                    }
                }
            }  else if (n.type === "environment") {
                if (outgoingNodeLinks.length !== 1)
                    throw new BadRequestException("Environment node must have one link from it.");
                if (incomingNodeLinks.length !== 1)
                    throw new BadRequestException("Environment node must have one link to it.");

                let link = outgoingNodeLinks[0];

                node = {
                    slug: n.id,
                    type: NodeType.Environment,
                    data: {
                        nextNode: link.to.id,
                        environmentId: n.properties.environmentId
                    }
                }
            } else if (n.type === "option") {
                let options = [];

                outgoingNodeLinks.forEach(l => {
                    let port = l.from.port;
                    let text = port.properties.text;
                    options.push({
                        text: text,
                        nextNode: l.to.id
                    });
                })

                node = {
                    slug: n.id,
                    type: NodeType.Option,
                    data: {
                        text: n.properties.text,
                        options: options
                    }
                }
            } else if (n.type === "exam-result" || n.type === "physical-exam") {
                if (outgoingNodeLinks.length !== 1)
                    throw new BadRequestException("Physical exam result node must have one link from it.");
                if (incomingNodeLinks.length < 1)
                    throw new BadRequestException("Physical exam result node must have at least one link to it.");

                let link = outgoingNodeLinks[0];

                node = {
                    slug: n.id,
                    type: NodeType.PhysicalExam,
                    data: {
                        nextNode: link.to.id
                    }
                }
            } else if (n.type === "patient-info") {
                if (outgoingNodeLinks.length !== 1)
                    throw new BadRequestException("Patient info node must have one link from it.");
                if (incomingNodeLinks.length < 1)
                    throw new BadRequestException("Patient info node must have at least one link to it.");

                let link = outgoingNodeLinks[0];

                node = {
                    slug: n.id,
                    type: NodeType.PatientInfo,
                    data: {
                        nextNode: link.to.id
                    }
                }
            } else if (n.type === "blood-tests") {
                if (outgoingNodeLinks.length !== 1)
                    throw new BadRequestException("Blood tests node must have one link from it.");
                if (incomingNodeLinks.length < 1)
                    throw new BadRequestException("Blood tests node must have at least one link to it.");

                let link = outgoingNodeLinks[0];

                node = {
                    slug: n.id,
                    type: NodeType.BloodTests,
                    data: {
                        nextNode: link.to.id
                    }
                }
            } else if (n.type === "arterial-blood-gas") {
                if (outgoingNodeLinks.length !== 1)
                    throw new BadRequestException("Arterial blood gas node must have one link from it.");
                if (incomingNodeLinks.length < 1)
                    throw new BadRequestException("Arterial blood gas node must have at least one link to it.");

                let link = outgoingNodeLinks[0];

                node = {
                    slug: n.id,
                    type: NodeType.ArterialBloodGas,
                    data: {
                        nextNode: link.to.id
                    }
                }
            }

            nodes.push(node);
        });
        return nodes;
    }

    async get(clientId: number, scenarioId: number): Promise<IGraph|null> {
        this.authorise(clientId);
        return await this.graphRepository.get(clientId, scenarioId)
    }

    async set(clientId: number, scenarioId: number, graph: IGraph): Promise<boolean> {
        this.authorise(clientId);

        return await this.graphRepository.set(clientId, scenarioId, graph);
    }


    private static getLink(id, fromNode: INode, fromPort: IPort, toNode: INode, toPort: IPort): IProcessedLink {
        return {
            id: id,
            from: {
                id: fromNode.id,
                type: fromNode.type,
                properties: fromNode.properties,
                port: fromPort
            },
            to: {
                id: toNode.id,
                type: toNode.type,
                properties: toNode.properties,
                port: toPort
            }
        }
    }

    authoriseRead(clientId: number): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;
        if (clientMismatch)
            throw new UnauthorizedException();
    }

    authorise(clientId: number): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < Role.SuperUser)
            throw new UnauthorizedException();
    }
}
