export interface IGraph {
    nodes: {
        [id: string]: INode;
    };
    links: {
        [id: string]: ILink;
    };
}

export interface INode {
    id: string;
    type: string;
    ports: {
        [id: string]: IPort;
    };
    properties?: any;
}
export interface IPort {
    id: string;
    type: string;
    value?: string;
    properties?: any;
}
export interface ILink {
    id: string;
    from: {
        nodeId: string;
        portId: string;
    };
    to: {
        nodeId?: string;
        portId?: string;
    };
    properties?: any;
}
