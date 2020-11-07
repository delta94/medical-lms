import {Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {PaginatedList} from "@/PaginatedList";
import {getQueryRequest} from "@/FilteredQueryRequest";
import {ScenarioDecisionService} from "@/scenario-decisions/scenario-decision.service";
import {ScenarioBaseAttempt, ScenarioDecision} from "@/scenario-decisions/scenario-decision.entity";

@Controller("/api/v1/clients/:clientId/scenario-attempts/:scenarioId")
@UseGuards(AuthGuard('jwt'))
export class ScenarioDecisionController {
    constructor(private readonly service: ScenarioDecisionService) {
    }

    @Post()
    async create(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("scenarioId", new ParseIntPipe()) scenarioId: number): Promise<ScenarioBaseAttempt> {
        return await this.service.create(clientId, scenarioId);
    }

    @Put()
    async update(@Param("clientId", new ParseIntPipe()) clientId: number,
                 @Param("scenarioId", new ParseIntPipe()) scenarioId: number,
                 @Body() data: ScenarioBaseAttempt): Promise<ScenarioBaseAttempt> {
        return await this.service.update(clientId, scenarioId, data);
    }

    @Get(":attemptId")
    async findById(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("attemptId", new ParseIntPipe()) attemptId: number): Promise<ScenarioBaseAttempt> {
        return await this.service.findById(clientId, attemptId);
    }

    @Get()
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("scenarioId", new ParseIntPipe()) scenarioId: number, @Query() query: any): Promise<PaginatedList<ScenarioBaseAttempt>> {
        return await this.service.findAttempts(clientId, scenarioId, getQueryRequest(query));
    }

    @Get(":attemptId/decisions")
    async findDecisions(@Param("clientId", new ParseIntPipe()) clientId: number,
                        @Param("scenarioId", new ParseIntPipe()) scenarioId: number,
                        @Param("attemptId", new ParseIntPipe()) attemptId: number): Promise<Array<ScenarioDecision>> {
        return await this.service.findDecisions(clientId, scenarioId, attemptId);
    }

    @Post(":attemptId/decisions")
    async createDecision(@Param("clientId", new ParseIntPipe()) clientId: number,
                         @Param("scenarioId", new ParseIntPipe()) scenarioId: number,
                         @Param("attemptId", new ParseIntPipe()) attemptId: number,
                         @Body() data: ScenarioDecision): Promise<ScenarioDecision> {
        return await this.service.createDecision(clientId, scenarioId, data);
    }

}
