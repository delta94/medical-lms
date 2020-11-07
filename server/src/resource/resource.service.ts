import {Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {ResourceRepository} from "@/resource/resource.repository";
import {Resource} from "./resource.entity";
import {Role} from "@/user/user.entity";
import {QueryRequest} from "@/FilteredQueryRequest";
import {PaginatedList} from "@/PaginatedList";

@Injectable({scope: Scope.REQUEST})
export class ResourceService {
    constructor(
        private readonly resourceRepository: ResourceRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async create(clientId: number, name: string, type: string, html: string, description: string): Promise<Resource> {
        this.authorise(clientId, Role.SuperUser);
        let resource: Resource = {
            clientId: clientId,
            name: name,
            type: type,
            html: html,
            description: description
        };
        return await this.resourceRepository.create(resource);
    }

    async find(clientId: number, queryRequest: QueryRequest): Promise<PaginatedList<Resource>> {
        this.authorise(clientId, Role.Standard);
        return await this.resourceRepository.find(clientId, queryRequest);
    }

    async findById(clientId: number, id: number): Promise<Resource | null> {
        this.authorise(clientId, Role.Standard);
        return await this.resourceRepository.findById(clientId, id);
    }

    async update(clientId: number, id: number, name: string, type: string, html: string, description: string): Promise<Resource> {
        this.authorise(clientId, Role.SuperUser);
        let resource = await this.findById(clientId, id);
        resource.name = name;
        resource.type = type;
        resource.html = html;
        resource.description = description;
        return await this.resourceRepository.update(resource);
    }

    async delete(clientId: number, id: number): Promise<boolean> {
        this.authorise(clientId, Role.SuperUser);
        return await this.resourceRepository.delete(clientId, id);
    }


    authorise(clientId: number, minRole: Role): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < minRole)
            throw new UnauthorizedException();
    }
}
