import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {QueryRequest} from "@/FilteredQueryRequest";
import {PaginatedList} from "@/PaginatedList";
import {Scenario} from "@/scenario/scenario.entity";
import {Patient} from "@/patient/patient.entity";

@Injectable()
export class ScenarioRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async create(scenario: Scenario): Promise<Scenario> {
        const sql = `INSERT INTO scenarios(client_id, name, description, cover_image, active)
        VALUES($(clientId), $(name), $(description), $(coverImage), $(active)) RETURNING id;`;
        let id = (await this.db.oneOrNone(sql, scenario))?.id;
        if (id !== null)
            return await this.findById(scenario.clientId, id);
        else
            return null;
    }

    async findNotEmpty(clientId: number, queryRequest: QueryRequest): Promise<PaginatedList<Scenario>> {
        let sql = `
                SELECT * 
                FROM scenarios
                WHERE client_id=$(clientId) AND name ILIKE $(searchTerm) AND deleted=false AND active=true
                ORDER BY ${queryRequest.sanitiseOrderBy(["id", "name", "description", "active"])}
                OFFSET $(offset) LIMIT $(pageSize);`;

        let scenarios = await this.db.manyOrNone(sql, {
            clientId,
            searchTerm: queryRequest.getSearchTerm,
            offset: queryRequest.offset,
            pageSize: queryRequest.pageSize,
        });

        sql = `
            SELECT COUNT(s.*) 
            FROM scenarios s
            WHERE client_id=$(clientId) AND name ILIKE $(searchTerm) AND deleted=false AND active=true;`;

        let result = await this.db.one(sql, {
            clientId,
            searchTerm: queryRequest.getSearchTerm
        });

        return new PaginatedList<Scenario>(scenarios, +result.count, queryRequest.pageSize, queryRequest.page);
    }

    async find(clientId: number, queryRequest: QueryRequest): Promise<PaginatedList<Scenario>> {
        let sql = `
                SELECT * FROM scenarios
                WHERE client_id=$(clientId) AND name ILIKE $(searchTerm) AND deleted=false
                ORDER BY ${queryRequest.sanitiseOrderBy(["id", "name", "description", "active"])}
                OFFSET $(offset) LIMIT $(pageSize);`;
        let scenarios = await this.db.manyOrNone(sql, {
            clientId,
            searchTerm: queryRequest.getSearchTerm,
            offset: queryRequest.offset,
            pageSize: queryRequest.pageSize,
        });

        sql = "SELECT COUNT(*) FROM scenarios WHERE client_id=$(clientId) AND name ILIKE $(searchTerm) AND deleted=false;";
        let result = await this.db.one(sql, {
            clientId,
            searchTerm: queryRequest.getSearchTerm
        });

        return new PaginatedList<Scenario>(scenarios, +result.count, queryRequest.pageSize, queryRequest.page);
    }

    async findById(clientId: number, id: number): Promise<Scenario | null> {
        const sql = "SELECT * FROM scenarios WHERE client_id=$(clientId) AND id=$(id) AND deleted=false;";
        return await this.db.oneOrNone(sql, {clientId, id});
    }

    async update(scenario: Scenario): Promise<Scenario | null> {
        const sql = "UPDATE scenarios SET name=$(name), description=$(description), cover_image=$(coverImage), active=$(active) WHERE client_id=$(clientId) AND id=$(id) AND deleted=false;";
        let rowsAffected = await this.db.result(sql, scenario, result => result.rowCount);
        if (rowsAffected == 1)
            return this.findById(scenario.clientId, scenario.id);
        else
            return null;
    }

    async delete(clientId: number, id: number): Promise<boolean> {
        const sql = "UPDATE scenarios SET deleted=true WHERE client_id=$(clientId) AND id=$(id);";
        let rowsAffected = await this.db.result(sql, {clientId, id}, result => result.rowCount);
        return rowsAffected == 1;
    }

    async hardDelete(clientId: number, id: number): Promise<boolean> {
        const sql = "DELETE FROM scenarios WHERE client_id=$(clientId) AND id=$(id);";
        let rowsAffected = await this.db.result(sql, {clientId, id}, result => result.rowCount);
        return rowsAffected == 1;
    }

    async findPatients(clientId: number, id: number, queryRequest: QueryRequest): Promise<PaginatedList<Patient>> {
        let sql = `
            SELECT p.* 
            FROM scenarios s
                JOIN scenario_patients sp ON sp.scenario_id = s.id
                    JOIN patients p ON p.id = sp.patient_id
            WHERE s.client_id=$(clientId) AND s.id=$(id)
                AND p.name ILIKE $(searchTerm)
            ORDER BY p.${queryRequest.sanitiseOrderBy(["id", "name"])}
            OFFSET $(offset) LIMIT $(pageSize);`;

        let patients = await this.db.manyOrNone(sql, {
            clientId,
            id,
            searchTerm: queryRequest.getSearchTerm,
            offset: queryRequest.offset,
            pageSize: queryRequest.pageSize,
        });

        sql = `
            SELECT COUNT(p.*) 
            FROM scenarios s
                JOIN scenario_patients sp ON sp.scenario_id = s.id
                    JOIN patients p ON p.id = sp.patient_id
            WHERE s.client_id=$(clientId) AND s.id=$(id)
                AND p.name ILIKE $(searchTerm);`;
        let result = await this.db.one(sql, {
            clientId,
            id,
            searchTerm: queryRequest.getSearchTerm
        });

        return new PaginatedList<Patient>(patients, +result.count, queryRequest.pageSize, queryRequest.page);
    }

    async addPatient(scenarioId: number, patientId: number): Promise<boolean> {
        const sql = "INSERT INTO scenario_patients(scenario_id, patient_id) VALUES($(scenarioId), $(patientId)) ON CONFLICT DO NOTHING;";
        let rowsAffected = await this.db.result(sql, {scenarioId, patientId}, result => result.rowCount);
        return rowsAffected == 1;
    }

    async removePatient(scenarioId: number, patientId: number): Promise<boolean> {
        const sql = "DELETE FROM scenario_patients WHERE scenario_id=$(scenarioId) AND patient_id=$(patientId);";
        let rowsAffected = await this.db.result(sql, {scenarioId, patientId}, result => result.rowCount);
        return rowsAffected == 1;
    }
}
