import {Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Role} from "@/user/user.entity";
import {QueryRequest} from "@/FilteredQueryRequest";
import {PaginatedList} from "@/PaginatedList";
import {Scenario} from "@/scenario/scenario.entity";
import {Patient} from "@/patient/patient.entity";
import {Environment} from "@/scenario/environment/environment.entity";
import {EnvironmentRepository} from "@/scenario/environment/environment.repository";

@Injectable({scope: Scope.REQUEST})
export class EnvironmentService {
    constructor(
        private readonly environmentRepository: EnvironmentRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async create(clientId: number, scenarioId: number, name: string, image: string): Promise<Environment> {
        this.authorise(clientId);

        let environment: Environment = {
            scenarioId: scenarioId,
            name: name,
            image: image
        };

        return await this.environmentRepository.create(clientId, environment);
    }

    async find(clientId: number, scenarioId: number, queryRequest: QueryRequest): Promise<PaginatedList<Environment>> {
        this.authorise(clientId);

        return await this.environmentRepository.find(clientId, scenarioId, queryRequest);
    }

    async findById(clientId: number, scenarioId: number, id: number): Promise<Environment | null> {
        this.authoriseRead(clientId);
        return await this.environmentRepository.findById(clientId, scenarioId, id);
    }

    async update(clientId: number, scenarioId: number, id: number, name: string, image: string): Promise<Environment> {
        this.authorise(clientId);
        let environment = await this.findById(clientId, scenarioId, id);
        environment.name = name;
        environment.image = image;

        return await this.environmentRepository.update(clientId, environment);
    }

    async delete(clientId: number, scenarioId: number, id: number): Promise<boolean> {
        this.authorise(clientId);
        return await this.environmentRepository.delete(clientId, scenarioId, id);
    }


    authoriseRead(clientId: number): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch)
            throw new UnauthorizedException();
    }

    authorise(clientId: number): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < Role.SuperUser)
            throw new UnauthorizedException();
    }
}
