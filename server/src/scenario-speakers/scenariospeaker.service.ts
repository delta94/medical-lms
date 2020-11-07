import {Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Role} from "@/user/user.entity";
import {QueryRequest} from "@/FilteredQueryRequest";
import {PaginatedList} from "@/PaginatedList";
import {ScenarioSpeakerRepository} from "@/scenario-speakers/scenariospeaker.repository";
import {ScenarioSpeaker} from "@/scenario-speakers/scenariospeaker.entity";

@Injectable({scope: Scope.REQUEST})
export class ScenarioSpeakerService {
    constructor(
        private readonly scenarioSpeakerRepository: ScenarioSpeakerRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async create(clientId: number, scenarioId: number, name: string, avatar: string | null): Promise<ScenarioSpeaker> {
        this.authorise(clientId, Role.SuperUser);

        let scenarioSpeaker: ScenarioSpeaker = {
            clientId: clientId,
            scenarioId: scenarioId,
            name: name,
            avatar: avatar
        };

        return await this.scenarioSpeakerRepository.create(scenarioSpeaker);
    }

    async find(clientId: number, scenarioId: number, queryRequest: QueryRequest): Promise<PaginatedList<ScenarioSpeaker>> {
        this.authorise(clientId, Role.Standard);

        return await this.scenarioSpeakerRepository.find(clientId, scenarioId, queryRequest);
    }

    async findById(clientId: number, scenarioId: number, id: number): Promise<ScenarioSpeaker | null> {
        this.authorise(clientId, Role.Standard);
        return await this.scenarioSpeakerRepository.findById(clientId, scenarioId, id);
    }

    async findByName(clientId: number, scenarioId: number, name: string): Promise<ScenarioSpeaker | null>{
        this.authorise(clientId, Role.Standard);
        return await this.scenarioSpeakerRepository.findByName(clientId, scenarioId, name);
    }

    async update(clientId: number, scenarioId: number,  id: number, name: string, avatar: string | null): Promise<ScenarioSpeaker> {
        this.authorise(clientId, Role.SuperUser);
        let scenarioSpeaker = await this.findById(clientId, scenarioId, id);
        scenarioSpeaker.name = name;
        scenarioSpeaker.avatar = avatar;

        return await this.scenarioSpeakerRepository.update(scenarioSpeaker);
    }

    async delete(clientId: number, scenarioId: number, id: number): Promise<boolean> {
        this.authorise(clientId, Role.SuperUser);
        return await this.scenarioSpeakerRepository.delete(clientId, scenarioId, id);
    }

    authorise(clientId: number, minRole: Role): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < minRole)
            throw new UnauthorizedException();
    }
}
