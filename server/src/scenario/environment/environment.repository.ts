import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {QueryRequest} from "@/FilteredQueryRequest";
import {PaginatedList} from "@/PaginatedList";
import {Environment} from "@/scenario/environment/environment.entity";

@Injectable()
export class EnvironmentRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async create(clientId: number, environment: Environment): Promise<Environment> {
        const sql = "INSERT INTO scenario_environments(scenario_id, name, image) VALUES($(scenarioId), $(name), $(image)) RETURNING id;";
        let id = (await this.db.oneOrNone(sql, environment))?.id;
        if (id !== null)
            return await this.findById(clientId, environment.scenarioId, id);
        else
            return null;
    }

    async find(clientId: number, scenarioId: number, queryRequest: QueryRequest): Promise<PaginatedList<Environment>> {
        let sql = `
                SELECT se.*
                FROM scenario_environments se
                    JOIN scenarios s ON s.id = se.scenario_id
                WHERE s.client_id=$(clientId) AND se.scenario_id=$(scenarioId) AND se.name ILIKE $(searchTerm)
                ORDER BY ${queryRequest.sanitiseOrderBy(["id", "name"])}
                OFFSET $(offset) LIMIT $(pageSize);`;
        let environments = await this.db.manyOrNone(sql, {
            clientId,
            scenarioId,
            searchTerm: queryRequest.getSearchTerm,
            offset: queryRequest.offset,
            pageSize: queryRequest.pageSize,
        });

        sql = "SELECT COUNT(se.*) as count FROM scenario_environments se JOIN scenarios s ON s.id = se.scenario_id WHERE s.client_id=$(clientId) AND se.scenario_id=$(scenarioId) AND se.name ILIKE $(searchTerm);";
        let result = await this.db.one(sql, {
            clientId,
            scenarioId,
            searchTerm: queryRequest.getSearchTerm
        });

        return new PaginatedList<Environment>(environments, +result.count, queryRequest.pageSize, queryRequest.page);
    }

    async findById(clientId: number, scenarioId: number, id: number): Promise<Environment | null> {
        const sql = `
            SELECT se.*
            FROM scenario_environments se
                JOIN scenarios s ON s.id = se.scenario_id
            WHERE s.client_id=$(clientId) AND se.scenario_id=$(scenarioId) AND se.id=$(id);`;
        return await this.db.oneOrNone(sql, {clientId, scenarioId, id});
    }

    async update(clientId: number, environment: Environment): Promise<Environment | null> {
        const sql = `
            UPDATE scenario_environments
            SET name=$(name), image=$(image)
            WHERE scenario_id = $(scenarioId) AND id = $(id);`;
        let rowsAffected = await this.db.result(sql, environment, result => result.rowCount);
        if (rowsAffected == 1)
            return this.findById(clientId, environment.scenarioId, environment.id);
        else
            return null;
    }

    async delete(clientId: number, scenarioId: number, id: number): Promise<boolean> {
        const sql = "DELETE FROM scenario_environments WHERE scenario_id=$(scenarioId) AND id=$(id);";
        let rowsAffected = await this.db.result(sql, {clientId, scenarioId, id}, result => result.rowCount);
        return rowsAffected == 1;
    }
}
