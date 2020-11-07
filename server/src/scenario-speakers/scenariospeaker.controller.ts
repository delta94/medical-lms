import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
    ValidationPipe
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {IsNotEmpty} from "class-validator";
import {PaginatedList} from "@/PaginatedList";
import {getQueryRequest} from "@/FilteredQueryRequest";
import {SuccessResult} from "@/SuccessResult";
import {ScenarioSpeakerService} from "@/scenario-speakers/scenariospeaker.service";
import {ScenarioSpeaker} from "@/scenario-speakers/scenariospeaker.entity";

export class CreateOrUpdateScenarioSpeakerModel {
    @IsNotEmpty()
    readonly name: string;
    readonly avatar: string | null;

}


@Controller("/api/v1/clients/:clientId/scenarios/:scenarioId/speakers")
@UseGuards(AuthGuard('jwt'))
export class ScenarioSpeakerController {
    constructor(private readonly scenarioSpeakerService: ScenarioSpeakerService) {
    }

    @Post()
    async create(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("scenarioId", new ParseIntPipe()) scenarioId: number, @Body() model: CreateOrUpdateScenarioSpeakerModel): Promise<ScenarioSpeaker> {
            return await this.scenarioSpeakerService.create(clientId, scenarioId, model.name, model.avatar);
    }


    @Get()
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("scenarioId", new ParseIntPipe()) scenarioId: number, @Query() query: any): Promise<PaginatedList<ScenarioSpeaker>> {
        return await this.scenarioSpeakerService.find(clientId, scenarioId, getQueryRequest(query));
    }

    @Get(":id")
    async findById(@Param("clientId", new ParseIntPipe()) clientId: number,@Param("scenarioId", new ParseIntPipe()) scenarioId: number,  @Param("id", new ParseIntPipe()) id: number): Promise<ScenarioSpeaker> {
        return await this.scenarioSpeakerService.findById(clientId, scenarioId, id);
    }

    @Get(":name")
    async findByName(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("scenarioId", new ParseIntPipe()) scenarioId: number, @Param("name", new ValidationPipe()) name: string): Promise<ScenarioSpeaker> {
        return await this.scenarioSpeakerService.findByName(clientId, scenarioId, name)
    }

    @Put(":id")
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("scenarioId", new ParseIntPipe()) scenarioId: number,  @Param("id", new ParseIntPipe()) id: number, @Body() model: CreateOrUpdateScenarioSpeakerModel): Promise<ScenarioSpeaker> {
            return await this.scenarioSpeakerService.update(clientId, scenarioId, id, model.name, model.avatar);
    }

    @Delete(":id")
    async delete(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("scenarioId", new ParseIntPipe()) scenarioId: number, @Param("id", new ParseIntPipe()) id: number): Promise<SuccessResult> {
        let success = await this.scenarioSpeakerService.delete(clientId, scenarioId, id);

        return new SuccessResult(success);
    }
}



