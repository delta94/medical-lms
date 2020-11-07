import {Inject, Injectable, Scope, UnauthorizedException} from '@nestjs/common';
import {REQUEST} from "@nestjs/core";
import {GroupRepository} from "@/group/group.repository";
import {Group} from "@/group/group.entity";
import {Role, User} from "@/user/user.entity";
import {QueryRequest} from "@/FilteredQueryRequest";
import {PaginatedList} from "@/PaginatedList";

@Injectable({scope: Scope.REQUEST})
export class GroupService {
    constructor(
        private readonly groupRepository: GroupRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async create(clientId: number, name: string): Promise<Group> {
        this.authorise(clientId);

        let group: Group = {
            clientId: clientId,
            name: name,
            isEveryone: false
        };
        return await this.groupRepository.create(group);
    }

    async find(clientId: number, queryRequest: QueryRequest): Promise<PaginatedList<Group>> {
        this.authorise(clientId);

        return await this.groupRepository.find(clientId, queryRequest);
    }

    async findById(clientId: number, id: number): Promise<Group|null> {
        this.authorise(clientId);

        return await this.groupRepository.findById(clientId, id);
    }

    async update(clientId: number, id: number, name: string): Promise<Group> {
        this.authorise(clientId);

        let group = await this.findById(clientId, id);
        group.name = name;
        return await this.groupRepository.update(group);
    }

    async delete(clientId: number, id: number): Promise<boolean> {
        this.authorise(clientId);
        return await this.groupRepository.delete(clientId, id);
    }

    async findMembers(clientId: number, id: number, queryRequest: QueryRequest): Promise<PaginatedList<User>> {
        this.authorise(clientId);

        return await this.groupRepository.findMembers(clientId, id, queryRequest);
    }

    async addMember(clientId: number, groupId: number, userId: number): Promise<boolean> {
        this.authorise(clientId);

        return await this.groupRepository.addMember(groupId, userId);
    }

    async removeMember(clientId: number, groupId: number, userId: number): Promise<boolean> {
        this.authorise(clientId);

        return await this.groupRepository.removeMember(groupId, userId);
    }

    async findChildGroups(clientId: number, id: number, queryRequest: QueryRequest): Promise<PaginatedList<Group>> {
        this.authorise(clientId);

        return await this.groupRepository.findChildGroups(clientId, id, queryRequest);
    }

    async addChildGroup(clientId: number, parentGroupId: number, childGroupId: number): Promise<boolean> {
        this.authorise(clientId);

        if (parentGroupId === childGroupId)
            return false;

        return await this.groupRepository.addChildGroup(parentGroupId, childGroupId);
    }

    async removeChildGroup(clientId: number, parentGroupId: number, childGroupId: number): Promise<boolean> {
        this.authorise(clientId);

        return await this.groupRepository.removeChildGroup(parentGroupId, childGroupId);
    }


    authorise(clientId: number): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < Role.SuperUser)
            throw new UnauthorizedException();
    }
}
