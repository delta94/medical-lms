import {Inject, Injectable} from "@nestjs/common";
import {NEST_PGPROMISE_CONNECTION} from "nest-pgpromise/dist";
import {PgPromiseDb} from "@/database/pgpromise";
import {Group} from "@/group/group.entity";
import {User} from "@/user/user.entity";
import {QueryRequest} from "@/FilteredQueryRequest";
import {PaginatedList} from "@/PaginatedList";

@Injectable()
export class GroupRepository {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly db: PgPromiseDb) {}

    async create(group: Group): Promise<Group|null> {
        const sql = "INSERT INTO groups(client_id, name, is_everyone) VALUES($(clientId), $(name), $(isEveryone)) RETURNING id;";
        let id = (await this.db.oneOrNone(sql, group))?.id;
        if (id !== null)
            return await this.findById(group.clientId, id);
        else
            return null;
    }

    async find(clientId: number, queryRequest: QueryRequest, includeEveryoneGroup: boolean = false): Promise<PaginatedList<Group>> {
        let sql = `
            SELECT * FROM groups
            WHERE client_id=$(clientId) AND name ILIKE $(searchTerm)
            ${includeEveryoneGroup ? "" : " AND is_everyone=false "}
            ORDER BY ${queryRequest.sanitiseOrderBy(["id", "name"])}
            OFFSET $(offset) LIMIT $(pageSize);`;

        let groups = await this.db.manyOrNone(sql, {
            clientId,
            searchTerm: queryRequest.getSearchTerm,
            offset: queryRequest.offset,
            pageSize: queryRequest.pageSize,
        });

        sql = `
            SELECT COUNT(*) FROM groups 
            WHERE client_id=$(clientId) AND name ILIKE $(searchTerm)
            ${includeEveryoneGroup ? "" : " AND is_everyone=false "};`;
        let result = await this.db.one(sql, {
            clientId,
            searchTerm: queryRequest.getSearchTerm
        });

        return new PaginatedList<Group>(groups, +result.count, queryRequest.pageSize, queryRequest.page);
    }

    async findById(clientId: number, id: number): Promise<Group|null> {
        const sql = "SELECT * FROM groups WHERE client_id=$(clientId) AND id=$(id);";
        return await this.db.oneOrNone(sql, {clientId, id});
    }

    async update(group: Group): Promise<Group|null> {
        const sql = "UPDATE groups SET name=$(name) WHERE client_id=$(clientId) AND id=$(id);";
        let rowsAffected = await this.db.result(sql, group, result => result.rowCount);
        if (rowsAffected == 1)
            return this.findById(group.clientId, group.id);
        else
            return null;
    }

    async delete(clientId: number, id: number): Promise<boolean> {
        const sql = "DELETE FROM groups WHERE client_id=$(clientId) AND id=$(id);";
        let rowsAffected = await this.db.result(sql, {clientId, id}, result => result.rowCount);
        return rowsAffected == 1;
    }


    async findMembers(clientId: number, id: number, queryRequest: QueryRequest): Promise<PaginatedList<User>> {
        let sql = `
            SELECT u.* 
            FROM groups g
                JOIN group_members gm ON gm.group_id = g.id
                    JOIN users u ON u.id = gm.user_id
            WHERE g.client_id=$(clientId) AND g.id=$(id)
                AND u.name ILIKE $(searchTerm)
            ORDER BY ${queryRequest.sanitiseOrderBy(["id", "name", "email", "role"])}
            OFFSET $(offset) LIMIT $(pageSize);`;

        let users = await this.db.manyOrNone(sql, {
            clientId,
            id,
            searchTerm: queryRequest.getSearchTerm,
            offset: queryRequest.offset,
            pageSize: queryRequest.pageSize,
        });

        sql = `
            SELECT COUNT(u.*) 
            FROM groups g
                JOIN group_members gm ON gm.group_id = g.id
                    JOIN users u ON u.id = gm.user_id
            WHERE g.client_id=$(clientId) AND g.id=$(id)
                AND u.name ILIKE $(searchTerm);`;
        let result = await this.db.one(sql, {
            clientId,
            id,
            searchTerm: queryRequest.getSearchTerm
        });

        return new PaginatedList<User>(users, +result.count, queryRequest.pageSize, queryRequest.page);
    }

    async addMember(groupId: number, userId: number): Promise<boolean> {
        const sql = "INSERT INTO group_members(group_id, user_id) VALUES($(groupId), $(userId)) ON CONFLICT DO NOTHING;";
        let rowsAffected = await this.db.result(sql, {groupId, userId}, result => result.rowCount);
        return rowsAffected == 1;
    }

    async removeMember(groupId: number, userId: number): Promise<boolean> {
        const sql = "DELETE FROM group_members WHERE group_id=$(groupId) AND user_id=$(userId);";
        let rowsAffected = await this.db.result(sql, {groupId, userId}, result => result.rowCount);
        return rowsAffected == 1;
    }

    async findChildGroups(clientId: number, id: number, queryRequest: QueryRequest): Promise<PaginatedList<Group>> {
        let sql = `
            SELECT g.* 
            FROM group_relations gr
                JOIN groups g ON g.id = gr.child_id
            WHERE g.client_id=$(clientId) AND gr.parent_id=$(id)
                AND g.name ILIKE $(searchTerm)
            OFFSET $(offset) LIMIT $(pageSize);`;

        let groups = await this.db.manyOrNone(sql, {
            clientId,
            id,
            searchTerm: queryRequest.getSearchTerm,
            offset: queryRequest.offset,
            pageSize: queryRequest.pageSize,
        });

        sql = `
            SELECT COUNT(g.*) 
            FROM group_relations gr
                JOIN groups g ON g.id = gr.child_id
            WHERE g.client_id=$(clientId) AND gr.parent_id=$(id)
                AND g.name ILIKE $(searchTerm);`;
        let result = await this.db.one(sql, {
            clientId,
            id,
            searchTerm: queryRequest.getSearchTerm
        });

        return new PaginatedList<Group>(groups, +result.count, queryRequest.pageSize, queryRequest.page);
    }

    async addChildGroup(parentGroupId: number, childGroupId: number): Promise<boolean> {
        const sql = "INSERT INTO group_relations(parent_id, child_id) VALUES($(parentGroupId), $(childGroupId)) ON CONFLICT DO NOTHING;";
        let rowsAffected = await this.db.result(sql, {parentGroupId, childGroupId}, result => result.rowCount);
        return rowsAffected == 1;
    }

    async removeChildGroup(parentGroupId: number, childGroupId: number): Promise<boolean> {
        const sql = "DELETE FROM group_relations WHERE parent_id=$(parentGroupId) AND child_id=$(childGroupId);";
        let rowsAffected = await this.db.result(sql, {parentGroupId, childGroupId}, result => result.rowCount);
        return rowsAffected == 1;
    }
}