import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {ScenarioSpeaker} from "@/scenario-speakers/scenariospeaker.entity";
import {QueryRequest} from "@/FilteredQueryRequest";
import {PaginatedList} from "@/PaginatedList";


@Injectable()
export class ScenarioSpeakerRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async create(scenarioSpeaker: ScenarioSpeaker): Promise<ScenarioSpeaker> {
        const sql = `INSERT INTO scenario_speakers(client_id, scenario_id, name, avatar)
        VALUES($(clientId), $(scenarioId), $(name), $(avatar)) RETURNING id;`;
        let id = (await this.db.oneOrNone(sql, scenarioSpeaker))?.id;
        if (id !== null)
            return await this.findById(scenarioSpeaker.clientId ,scenarioSpeaker.scenarioId, id);
        else
            return null;
    }

    async findById(clientId: number, scenarioId: number, id: number): Promise<ScenarioSpeaker | null> {
        const sql = "SELECT * FROM scenario_speakers WHERE client_id=$(clientId) AND scenario_id=$(scenarioId) AND id=$(id);";
        return await this.db.oneOrNone(sql, {clientId, scenarioId, id});
    }

    async findByName(clientId: number, scenarioId: number, name: string): Promise<ScenarioSpeaker | null>{
        const sql = "SELECT * FROM scenario_speakers WHERE client_id=$(clientId) AND scenario_id=$(scenarioId) AND name=$(name);";
        return await this.db.oneOrNone(sql, {clientId, scenarioId, name})
    }

    async update(scenarioSpeaker: ScenarioSpeaker): Promise<ScenarioSpeaker | null> {
        const sql = "UPDATE scenario_speakers SET name=$(name), avatar=$(avatar) WHERE client_id=$(clientId) AND scenario_id=$(scenarioId) AND id=$(id);";
        let rowsAffected = await this.db.result(sql, scenarioSpeaker, result => result.rowCount);
        if (rowsAffected == 1)
            return this.findById(scenarioSpeaker.clientId, scenarioSpeaker.scenarioId, scenarioSpeaker.id);
        else
            return null;
    }

    async delete(clientId: number, scenarioId: number, id: number): Promise<boolean> {
        const sql = "DELETE FROM scenario_speakers WHERE client_id=$(clientId) AND scenario_id=$(scenarioId) AND id=$(id);";
        let rowsAffected = await this.db.result(sql, {clientId, scenarioId, id}, result => result.rowCount);
        return rowsAffected == 1;
    }

    async find(clientId: number, scenarioId: number, queryRequest: QueryRequest): Promise<PaginatedList<ScenarioSpeaker>> {
        let sql = `
                SELECT * FROM scenario_speakers
                WHERE client_id=$(clientId) AND scenario_id=$(scenarioId) AND name ILIKE $(searchTerm)
                ORDER BY ${queryRequest.sanitiseOrderBy(["id", "name"])}
                OFFSET $(offset) LIMIT $(pageSize);`;
        let scenarioSpeakers = await this.db.manyOrNone(sql, {
            clientId,
            scenarioId,
            searchTerm: queryRequest.getSearchTerm,
            offset: queryRequest.offset,
            pageSize: queryRequest.pageSize,
        });

        sql = "SELECT COUNT(*) FROM scenario_speakers WHERE client_id=$(clientId) AND scenario_id=$(scenarioId) AND name ILIKE $(searchTerm);";
        let result = await this.db.one(sql, {
            clientId,
            scenarioId,
            searchTerm: queryRequest.getSearchTerm
        });

        return new PaginatedList<ScenarioSpeaker>(scenarioSpeakers, +result.count, queryRequest.pageSize, queryRequest.page);
    }

}
