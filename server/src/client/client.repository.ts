import {Client} from "./client.entity";
import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {QueryRequest} from "@/FilteredQueryRequest";
import {PaginatedList} from "@/PaginatedList";
import {IFeatureStatus} from "@/feature/feature.service";

@Injectable()
export class ClientRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {}

    async create(client: Client): Promise<Client|null> {
        const sql = "INSERT INTO clients(name, disabled, subdomain, logo) VALUES($(name), $(disabled), $(subdomain), $(logo)) RETURNING id;";
        let id = (await this.db.oneOrNone(sql, client))?.id;
        if (id !== null)
            return await this.findById(id);
        else
            return null;
    }

    async find(queryRequest: QueryRequest): Promise<PaginatedList<Client>> {
        let sql = `
                SELECT * FROM clients
                WHERE name ILIKE $(searchTerm) 
                ORDER BY ${queryRequest.sanitiseOrderBy(["id", "name", "subdomain", "disabled"])}
                OFFSET $(offset) LIMIT $(pageSize);`;
        let clients = await this.db.manyOrNone(sql, {
            searchTerm: queryRequest.getSearchTerm,
            offset: queryRequest.offset,
            pageSize: queryRequest.pageSize,
        });

        sql = "SELECT COUNT(*) FROM clients WHERE name ILIKE $(searchTerm);";
        let result = await this.db.one(sql, {
            searchTerm: queryRequest.getSearchTerm
        });

        return new PaginatedList<Client>(clients, +result.count, queryRequest.pageSize, queryRequest.page);
    }

    async findById(id: number): Promise<Client|null> {
        const sql = "SELECT * FROM clients WHERE id=$(id);";
        return await this.db.oneOrNone(sql, {id});
    }

    async findSubdomainById(id: number): Promise<string|null> {
        const sql = "SELECT subdomain FROM clients WHERE id=$(id);";
        return (await this.db.oneOrNone(sql, {id}))?.subdomain;
    }

    async findBySubdomain(subdomain: string): Promise<Client> {
        const sql = "SELECT * FROM clients WHERE subdomain=$(subdomain);";
        return await this.db.oneOrNone(sql, {subdomain});
    }

    async getFeatureFlagsForClient(clientId: number): Promise<Map<string, IFeatureStatus>> {
        const sql = `
            SELECT features
            FROM client_features WHERE client_id=$(clientId);`;
        let result = await this.db.oneOrNone(sql, {clientId});
        if (!result)
            return new Map<string, IFeatureStatus>();

        return new Map<string, IFeatureStatus>(Object.entries(result.features));
    }

    async setFeatureFlagsForClient(clientId: number, flags: Map<string, IFeatureStatus>): Promise<boolean> {
        let currentFlags = await this.getFeatureFlagsForClient(clientId);
        let sql = "";

        if (currentFlags.size > 0) {
            if (flags.size === 0) {
                sql = "DELETE FROM client_features WHERE client_id=$(clientId);";
            } else {
                sql = "UPDATE client_features SET features=$(features) WHERE client_id=$(clientId);";
            }
        } else {
            sql = "INSERT INTO client_features(client_id, features) VALUES($(clientId), $(features));";
        }

        if (currentFlags.size === 0 && flags.size === 0) {
            return true;
        }

        let rowsAffected = await this.db.result(sql, {clientId, features: Object.fromEntries(flags)}, result => result.rowCount);
        return rowsAffected == 1;
    }

    async isFeatureEnabled(clientId: number, featureKey: string): Promise<IFeatureStatus> {
        const sql = `
            SELECT features->$(featureKey) as status
            FROM client_features WHERE client_id=$(clientId);`;
        let result = await this.db.oneOrNone(sql, {clientId, featureKey});
        if (!result?.status)
            return {enabled: null};

        return result.status as IFeatureStatus;
    }

    async update(client: Client): Promise<Client|null> {
        const sql = "UPDATE clients SET name=$(name), disabled=$(disabled), subdomain=$(subdomain), logo=$(logo) WHERE id=$(id);";
        let rowsAffected = await this.db.result(sql, client, result => result.rowCount);
        if (rowsAffected == 1)
            return this.findById(client.id);
        else
            return null;
    }

    async delete(id: number): Promise<boolean> {
        const sql = "DELETE FROM clients WHERE id=$(id);";
        let rowsAffected = await this.db.result(sql, {id}, result => result.rowCount);
        return rowsAffected == 1;
    }
}