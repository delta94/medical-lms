import {Module} from "@nestjs/common";
import {GraphRepository} from "./graph.repository";
import {GraphService} from "./graph.service";
import {GraphController} from "@/scenario-graph/graph.controller";

@Module({
    exports: [GraphRepository],
    controllers: [GraphController],
    providers: [GraphService, GraphRepository]
})
export class GraphModule {
}
