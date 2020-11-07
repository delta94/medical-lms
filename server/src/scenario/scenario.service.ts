import {BadRequestException, Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Role, User} from "@/user/user.entity";
import {QueryRequest} from "@/FilteredQueryRequest";
import {PaginatedList} from "@/PaginatedList";
import {ScenarioRepository} from "@/scenario/scenario.repository";
import {Scenario} from "@/scenario/scenario.entity";
import {Patient} from "@/patient/patient.entity";
import {PatientRepository} from "@/patient/patient.repository";
import {ScenarioSpeakerRepository} from "@/scenario-speakers/scenariospeaker.repository";
import {ScenarioSpeaker} from "@/scenario-speakers/scenariospeaker.entity";

@Injectable({scope: Scope.REQUEST})
export class ScenarioService {
    constructor(
        private readonly scenarioRepository: ScenarioRepository,
        private readonly patientRepository: PatientRepository,
        private readonly scenarioSpeakerRepository: ScenarioSpeakerRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async create(clientId: number, name: string, description: string, coverImage: string | null, active: boolean): Promise<Scenario> {
        this.authorise(clientId);

        let scenario: Scenario = {
            clientId: clientId,
            name: name,
            description: description,
            coverImage: coverImage,
            active: active
        };

        return await this.scenarioRepository.create(scenario);
    }

    async findNotEmpty(clientId: number, queryRequest: QueryRequest): Promise<PaginatedList<Scenario>> {
        this.authoriseRead(clientId);

        return await this.scenarioRepository.findNotEmpty(clientId, queryRequest);
    }

    async find(clientId: number, queryRequest: QueryRequest): Promise<PaginatedList<Scenario>> {
        this.authorise(clientId);

        return await this.scenarioRepository.find(clientId, queryRequest);
    }

    async findById(clientId: number, id: number): Promise<Scenario | null> {
        this.authoriseRead(clientId);
        return await this.scenarioRepository.findById(clientId, id);
    }

    async update(clientId: number, id: number, name: string, description: string, coverImage: string | null, active: boolean): Promise<Scenario> {
        this.authorise(clientId);
        let scenario = await this.findById(clientId, id);
        scenario.name = name;
        scenario.description = description;
        scenario.active = active;
        scenario.coverImage = coverImage;

        return await this.scenarioRepository.update(scenario);
    }

    async delete(clientId: number, id: number): Promise<boolean> {
        this.authorise(clientId);
        return await this.scenarioRepository.delete(clientId, id);
    }

    async findPatients(clientId: number, id: number, queryRequest: QueryRequest): Promise<PaginatedList<Patient>> {
        this.authoriseRead(clientId);

        return await this.scenarioRepository.findPatients(clientId, id, queryRequest);
    }

    async addPatient(clientId: number, scenarioId: number, patientId: number): Promise<boolean> {
        this.authorise(clientId);
        let patient = await this.patientRepository.findById(clientId, patientId);
        let scenarioSpeaker: ScenarioSpeaker = {
            clientId: clientId,
            scenarioId: scenarioId,
            name: patient.name,
            avatar: ""
        };
        await this.scenarioSpeakerRepository.create(scenarioSpeaker);
        return await this.scenarioRepository.addPatient(scenarioId, patientId);
    }

    async removePatient(clientId: number, scenarioId: number, patientId: number): Promise<boolean> {
        this.authorise(clientId);

        return await this.scenarioRepository.removePatient(scenarioId, patientId);
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
