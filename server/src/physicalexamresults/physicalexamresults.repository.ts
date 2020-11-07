import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {PhysicalExamResults} from "@/physicalexamresults/physicalexamresults.entity";
import {PaginatedList} from "@/PaginatedList";
import {QueryRequest} from "@/FilteredQueryRequest";

@Injectable()
export class PhysicalExamResultsRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async create(examResult: PhysicalExamResults): Promise<PhysicalExamResults> {
        const sql = "INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(clientId), $(patientId), $(regionId), $(result), $(appropriate)) RETURNING id;";
        let id = (await this.db.oneOrNone(sql, examResult))?.id;
        if (id !== null)
            return await this.findById(examResult.clientId, id, examResult.patientId);
        else
            return null;
    }

    //TODO make this actually only get one
    async find(clientId: number, patientId: number, queryRequest: QueryRequest): Promise<PaginatedList<PhysicalExamResults>> {
        let sql = `
                SELECT er.*, r.name FROM patient_physical_exam_results er
                JOIN physical_exam_regions r ON r.id = er.region_id
                WHERE client_id=$(clientId) AND patient_id=$(patientId) AND result ILIKE $(searchTerm)
                ORDER BY ${queryRequest.sanitiseOrderBy(["id"])}
                OFFSET $(offset) LIMIT $(pageSize);`;
        let examResults = await this.db.manyOrNone(sql, {
            clientId,
            patientId,
            searchTerm: queryRequest.getSearchTerm,
            offset: queryRequest.offset,
            pageSize: queryRequest.pageSize
        });

        sql = "SELECT COUNT(*) FROM patient_physical_exam_results WHERE client_id=$(clientId) AND patient_id=$(patientId) AND result ILIKE $(searchTerm);";
        let result = await this.db.one(sql, {
            clientId,
            patientId,
            searchTerm: queryRequest.getSearchTerm
        });

        return new PaginatedList<PhysicalExamResults>(examResults, +result.count, queryRequest.pageSize, queryRequest.page);
    }

    async findById(clientId: number, patientId: number, id: number): Promise<PhysicalExamResults | null> {
        const sql = "SELECT * FROM patient_physical_exam_results WHERE client_id=$(clientId) AND patient_id=$(patientId) AND id=$(id);";
        return await this.db.oneOrNone(sql, {clientId, id, patientId});
    }

    async update(examResult: PhysicalExamResults): Promise<PhysicalExamResults | null> {
        const sql = "UPDATE patient_physical_exam_results SET region_id=$(regionId), result=$(result), appropriate=$(appropriate) WHERE client_id=$(clientId) AND patient_id=$(patientId)  AND id=$(id);";
        let rowsAffected = await this.db.result(sql, examResult, result => result.rowCount);
        if (rowsAffected == 1)
            return this.findById(examResult.clientId, examResult.patientId, examResult.id);
        else
            return null;
    }
}
