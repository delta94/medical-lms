import {User} from "./user.entity";
import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {PaginatedList} from "@/PaginatedList";
import {QueryRequest} from "@/FilteredQueryRequest";

@Injectable()
export class UserRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {
    }

    async create(user: User): Promise<User | null> {
        let sql = "INSERT INTO users(client_id, name, email, role, disabled) VALUES($(clientId), $(name), $(email), $(role), $(disabled)) RETURNING id;";
        let id = (await this.db.oneOrNone(sql, user))?.id;
        if (id !== null) {
            sql = `
                INSERT INTO group_members(group_id, user_id)
                SELECT id, $(userId) FROM groups g
                WHERE g.is_everyone=true;`;
            await this.db.query(sql, {userId: id});

            return await this.findById(user.clientId, id);
        } else {
            return null;
        }
    }

    async find(clientId: number, queryRequest: QueryRequest): Promise<PaginatedList<User>> {
        let sql = `
                SELECT * FROM users
                WHERE client_id=$(clientId) AND name ILIKE $(searchTerm)
                ORDER BY ${queryRequest.sanitiseOrderBy(["id", "name", "email", "role", "disabled"])}
                OFFSET $(offset) LIMIT $(pageSize);`;
        let users = await this.db.manyOrNone(sql, {
            clientId,
            searchTerm: queryRequest.getSearchTerm,
            offset: queryRequest.offset,
            pageSize: queryRequest.pageSize,
        });

        sql = "SELECT COUNT(*) FROM users WHERE client_id=$(clientId) AND name ILIKE $(searchTerm);";
        let result = await this.db.one(sql, {
            clientId,
            searchTerm: queryRequest.getSearchTerm
        });

        return new PaginatedList<User>(users, +result.count, queryRequest.pageSize, queryRequest.page);
    }

    async findById(clientId: number, id: number): Promise<User | null> {
        const sql = "SELECT * FROM users WHERE client_id=$(clientId) AND id=$(id);";
        return await this.db.oneOrNone(sql, {clientId, id});
    }

    async findByEmail(email: string): Promise<User | null> {
        const sql = "SELECT * FROM users WHERE email=$(email);";
        return await this.db.oneOrNone(sql, {email});
    }

    async findBySamlIdentifier(identifier: string): Promise<User | null> {
        const sql = `
            SELECT u.* 
            FROM users u
                LEFT JOIN saml_auth sa ON sa.user_id = u.id
            WHERE sa.identifier=$(identifier);`;
        return await this.db.oneOrNone(sql, {identifier});
    }

    async update(user: User): Promise<User | null> {
        const sql = "UPDATE users SET name=$(name), email=$(email), role=$(role), disabled=$(disabled) WHERE client_id=$(clientId) AND id=$(id);";
        let rowsAffected = await this.db.result(sql, user, result => result.rowCount);
        if (rowsAffected == 1)
            return this.findById(user.clientId, user.id);
        else
            return null;
    }

    async delete(clientId: number, id: number): Promise<boolean> {
        const sql = "DELETE FROM users WHERE client_id=$(clientId) AND id=$(id);";
        let rowsAffected = await this.db.result(sql, {clientId, id}, result => result.rowCount);
        return rowsAffected == 1;
    }
}