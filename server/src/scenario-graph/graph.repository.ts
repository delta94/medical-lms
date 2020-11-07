import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {ScenarioNode} from "@/scenario-graph/node.entity";
import {IGraph} from "@/scenario-graph/types";

@Injectable()
export class GraphRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async getActive(clientId: number, scenarioId: number): Promise<IGraph|null> {
        const sql = `
                SELECT sg.*
                FROM scenarios s
                    JOIN scenario_graph sg ON sg.scenario_id = s.id
                WHERE s.id=$(scenarioId) AND s.client_id=$(clientId) AND s.active=true;`;

        return await this.db.oneOrNone(sql, {clientId, scenarioId});
    }

    async get(clientId: number, scenarioId: number): Promise<IGraph|null> {
        const sql = `
                SELECT sg.*
                FROM scenarios s
                    JOIN scenario_graph sg ON sg.scenario_id = s.id
                WHERE s.id=$(scenarioId) AND s.client_id=$(clientId);`;

        return await this.db.oneOrNone(sql, {clientId, scenarioId});
    }

    async set(clientId: number, scenarioId: number, graph: IGraph): Promise<boolean> {
        let currentGraph = await this.get(clientId, scenarioId);
        if (currentGraph === null) {
            let sql = "INSERT INTO scenario_graph(scenario_id, nodes, links) VALUES($(scenarioId), $(nodes), $(links));";
            await this.db.query(sql, {scenarioId, nodes: graph.nodes, links: graph.links});
        } else {
            let sql = "UPDATE scenario_graph SET nodes=$(nodes), links=$(links) WHERE scenario_id=$(scenarioId);";
            await this.db.query(sql, {scenarioId, nodes: graph.nodes, links: graph.links});
        }

        return true;
    }
}
