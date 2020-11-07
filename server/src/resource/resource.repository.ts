import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {Resource} from "./resource.entity";
import {QueryRequest} from "@/FilteredQueryRequest";
import {PaginatedList} from "@/PaginatedList";

@Injectable()
export class ResourceRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async create(resource: Resource): Promise<Resource> {
        const sql = "INSERT INTO resources(client_id, name, type, html, description) VALUES($(clientId), $(name), $(type), $(html), $(description)) RETURNING id;";
        let id = (await this.db.oneOrNone(sql, resource))?.id;
        if (id !== null)
            return await this.findById(resource.clientId, id);
        else
            return null;
    }

    async find(clientId: number, queryRequest: QueryRequest): Promise<PaginatedList<Resource>> {
        let sql = `
                SELECT * FROM resources
                WHERE client_id=$(clientId) AND name ILIKE $(searchTerm)
                ORDER BY ${queryRequest.sanitiseOrderBy(["id", "name", "type", "description"])}
                OFFSET $(offset) LIMIT $(pageSize);`;
        let resources = await this.db.manyOrNone(sql, {
            clientId,
            searchTerm: queryRequest.getSearchTerm,
            offset: queryRequest.offset,
            pageSize: queryRequest.pageSize
        });

        sql = "SELECT COUNT(*) FROM resources WHERE client_id=$(clientId) AND name ILIKE $(searchTerm);";
        let result = await this.db.one(sql, {
            clientId,
            searchTerm: queryRequest.getSearchTerm
        });

        return new PaginatedList<Resource>(resources, +result.count, queryRequest.pageSize, queryRequest.page);
    }



    async findById(clientId: number, id: number): Promise<Resource | null> {
        const sql = "SELECT * FROM resources WHERE client_id=$(clientId) AND id=$(id);";
        return await this.db.oneOrNone(sql, {clientId, id});
    }

    async update(resource: Resource): Promise<Resource | null> {
        const sql = "UPDATE resources SET name=$(name), type=$(type), html=$(html), description=$(description) WHERE client_id=$(clientId) AND id=$(id);";
        let rowsAffected = await this.db.result(sql, resource, result => result.rowCount);
        if (rowsAffected == 1)
            return this.findById(resource.clientId, resource.id);
        else
            return null;
    }

    async delete(clientId: number, id: number): Promise<boolean> {
        const sql = "DELETE FROM resources WHERE client_id=$(clientId) AND id=$(id);";
        let rowsAffected = await this.db.result(sql, {clientId, id}, result => result.rowCount);
        return rowsAffected == 1;
    }
}
