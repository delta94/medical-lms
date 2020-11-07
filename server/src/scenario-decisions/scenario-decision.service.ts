import {Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Role} from "@/user/user.entity";
import {QueryRequest} from "@/FilteredQueryRequest";
import {PaginatedList} from "@/PaginatedList";
import {ScenarioDecisionRepository} from "@/scenario-decisions/scenario-decision.repository";
import {ScenarioBaseAttempt, ScenarioDecision} from "@/scenario-decisions/scenario-decision.entity";

@Injectable({scope: Scope.REQUEST})
export class ScenarioDecisionService {
    constructor(
        private readonly repository: ScenarioDecisionRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async create(clientId: number, scenarioId: number): Promise<ScenarioBaseAttempt> {
        this.authorise(clientId);
        return await this.repository.createAttempt(clientId, scenarioId);
    }

    async findById(clientId: number, attemptId: number): Promise<ScenarioBaseAttempt> {
        this.authorise(clientId);
        return await this.repository.findAttemptById(attemptId);
    }

    async update(clientId: number, scenarioId: number, data: ScenarioBaseAttempt) : Promise<ScenarioBaseAttempt>{
        this.authorise(clientId);
        return await this.repository.update(clientId, scenarioId, data);
    }


    async findAttempts(clientId: number, scenarioId: number, queryRequest: QueryRequest): Promise<PaginatedList<ScenarioBaseAttempt>> {
        this.authorise(clientId);
        return await this.repository.findAttempts(clientId, scenarioId, queryRequest);
    }

    async findDecisions(clientId: number, scenarioId: number, attemptId: number): Promise<Array<ScenarioDecision>>{
        this.authorise(clientId);
        return await this.repository.findDecisions(clientId, scenarioId, attemptId);
    }

    async createDecision(clientId: number, scenarioId: number, decision: ScenarioDecision) : Promise<ScenarioDecision>{
        this.authorise(clientId);
        return await this.repository.createDecision(clientId, scenarioId, decision);
    }

    authorise(clientId: number, minRole: Role = Role.Standard): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < minRole)
            throw new UnauthorizedException();
    }
}
