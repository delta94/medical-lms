import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {Patient} from "@/patient/patient.entity";
import {QueryRequest} from "@/FilteredQueryRequest";
import {PaginatedList} from "@/PaginatedList";

@Injectable()
export class PatientRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async create(patient: Patient): Promise<Patient> {
        const sql = `INSERT INTO patients(client_id, name, age, is_female, description, height, weight, ethnicity)
        VALUES($(clientId), $(name), $(age), $(isFemale), $(description), $(height), $(weight), $(ethnicity)) RETURNING id;`;
        let id = (await this.db.oneOrNone(sql, patient))?.id;
        if (id !== null)
            return await this.findById(patient.clientId, id);
        else
            return null;
    }

    async find(clientId: number, queryRequest: QueryRequest): Promise<PaginatedList<Patient>> {
        let sql = `
                SELECT * FROM patients
                WHERE client_id=$(clientId) AND name ILIKE $(searchTerm) AND deleted=false
                ORDER BY ${queryRequest.sanitiseOrderBy(["id", "name", "age", "description", "height", "weight"])}
                OFFSET $(offset) LIMIT $(pageSize);`;
        let patients = await this.db.manyOrNone(sql, {
            clientId,
            searchTerm: queryRequest.getSearchTerm,
            offset: queryRequest.offset,
            pageSize: queryRequest.pageSize,
        });

        sql = "SELECT COUNT(*) FROM patients WHERE client_id=$(clientId) AND name ILIKE $(searchTerm) AND deleted=false;";
        let result = await this.db.one(sql, {
            clientId,
            searchTerm: queryRequest.getSearchTerm
        });

        return new PaginatedList<Patient>(patients, +result.count, queryRequest.pageSize, queryRequest.page);
    }

    async findById(clientId: number, id: number): Promise<Patient | null> {
        const sql = "SELECT * FROM patients WHERE client_id=$(clientId) AND id=$(id) AND deleted=false;";
        return await this.db.oneOrNone(sql, {clientId, id});
    }

    async update(patient: Patient): Promise<Patient | null> {
        const sql = "UPDATE patients SET name=$(name), age=$(age), is_female=$(isFemale), description=$(description), height=$(height), weight=$(weight), ethnicity=$(ethnicity) WHERE client_id=$(clientId) AND id=$(id) AND deleted=false;";
        let rowsAffected = await this.db.result(sql, patient, result => result.rowCount);
        if (rowsAffected == 1)
            return this.findById(patient.clientId, patient.id);
        else
            return null;
    }

    async delete(clientId: number, id: number): Promise<boolean> {
        const sql = "UPDATE patients SET deleted=true WHERE client_id=$(clientId) AND id=$(id);";
        let rowsAffected = await this.db.result(sql, {clientId, id}, result => result.rowCount);
        return rowsAffected == 1;
    }

    async hardDelete(clientId: number, id: number): Promise<boolean> {
        const sql = "DELETE FROM patients WHERE client_id=$(clientId) AND id=$(id);";
        let rowsAffected = await this.db.result(sql, {clientId, id}, result => result.rowCount);
        return rowsAffected == 1;
    }
}
