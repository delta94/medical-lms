import {Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Put, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {GraphService} from "@/scenario-graph/graph.service";
import {IGraph} from "@/scenario-graph/types";
import {SuccessResult} from "@/SuccessResult";
import {NodeType} from "@/scenario-graph/node.entity";

@Controller("/api/v1/clients/:clientId/scenarios/:scenarioId/graph")
@UseGuards(AuthGuard('jwt'))
export class GraphController {
    constructor(private readonly graphService: GraphService) {
    }

    @Get()
    async get(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("scenarioId", new ParseIntPipe()) scenarioId: number): Promise<IGraph> {
        let result = await this.graphService.get(clientId, scenarioId);
        if (result === null) throw new NotFoundException();
        return result;
    }

    @Get("/data")
    async findData(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("scenarioId", new ParseIntPipe()) scenarioId: number): Promise<any> {
        let nodes = await this.graphService.findAsNodeArray(clientId, scenarioId);
        if (nodes && nodes.length) {
            let start = nodes.find(n => n.type === NodeType.Start).data.nextNode;

            const json = {
                rootNode: start,
                nodes: []
            };

            nodes.forEach((value) => {
                const node = {
                    id: value.slug,
                    type: value.type
                };

                if (value.data) {
                    for (let key in value.data) {
                        if (value.data.hasOwnProperty(key)) {
                            node[key] = value.data[key];
                        }
                    }
                }
                json.nodes.push(node);
            });

            return json;
        }

        return {};
    }

    @Put()
    async set(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("scenarioId", new ParseIntPipe()) scenarioId: number, @Body() model: IGraph): Promise<SuccessResult> {
        let success = await this.graphService.set(clientId, scenarioId, model);
        return new SuccessResult(success);
    }
}
