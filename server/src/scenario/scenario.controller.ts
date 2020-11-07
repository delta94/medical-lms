import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {IsBoolean, IsInt, IsNotEmpty} from "class-validator";
import {PaginatedList} from "@/PaginatedList";
import {getQueryRequest} from "@/FilteredQueryRequest";
import {SuccessResult} from "@/SuccessResult";
import {ScenarioService} from "@/scenario/scenario.service";
import {Scenario} from "@/scenario/scenario.entity";
import {Patient} from "@/patient/patient.entity";

export class CreateOrUpdateScenarioModel {
    @IsNotEmpty()
    readonly name: string;
    @IsNotEmpty()
    readonly description: string;
    readonly coverImage: string | null;
    @IsNotEmpty()
    @IsBoolean()
    readonly active: boolean;

}

export class AddPatientModel {
    @IsNotEmpty()
    @IsInt()
    readonly patientId: number;
}

@Controller("/api/v1/clients/:clientId/scenarios")
@UseGuards(AuthGuard('jwt'))
export class ScenarioController {
    constructor(private readonly scenarioService: ScenarioService) {
    }

    @Post()
    async create(@Param("clientId", new ParseIntPipe()) clientId: number, @Body() model: CreateOrUpdateScenarioModel): Promise<Scenario> {
        if (validateImage(model.coverImage))
            return await this.scenarioService.create(clientId, model.name, model.description, model.coverImage, model.active);
    }

    @Get("/not-empty")
    async findNotEmpty(@Param("clientId", new ParseIntPipe()) clientId: number, @Query() query: any): Promise<PaginatedList<Scenario>> {
        return await this.scenarioService.findNotEmpty(clientId, getQueryRequest(query));
    }

    @Get()
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Query() query: any): Promise<PaginatedList<Scenario>> {
        return await this.scenarioService.find(clientId, getQueryRequest(query));
    }

    @Get(":id")
    async findById(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number): Promise<Scenario> {
        return await this.scenarioService.findById(clientId, id);
    }

    @Put(":id")
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number, @Body() model: CreateOrUpdateScenarioModel): Promise<Scenario> {
        if (validateImage(model.coverImage))
            return await this.scenarioService.update(clientId, id, model.name, model.description, model.coverImage, model.active);
    }

    @Delete(":id")
    async delete(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number): Promise<SuccessResult> {
        let success = await this.scenarioService.delete(clientId, id);

        return new SuccessResult(success);
    }

    @Get(":id/patients")
    async findPatients(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number, @Query() query: any): Promise<PaginatedList<Patient>> {
        return await this.scenarioService.findPatients(clientId, id, getQueryRequest(query));
    }

    @Post(":scenarioId/patients")
    async addMember(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("scenarioId", new ParseIntPipe()) scenarioId: number, @Body() model: AddPatientModel): Promise<SuccessResult> {
        let success = await this.scenarioService.addPatient(clientId, scenarioId, model.patientId);
        return new SuccessResult(success);
    }

    @Delete(":scenarioId/patients/:patientId")
    async removeMember(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("scenarioId", new ParseIntPipe()) scenarioId: number, @Param("patientId", new ParseIntPipe()) patientId: number): Promise<SuccessResult> {
        let success = await this.scenarioService.removePatient(clientId, scenarioId, patientId);
        return new SuccessResult(success);
    }
}

export function validateImage(image: string | null): boolean {
    let valid = false;
    if (image) {
        const mime = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
        if (mime && mime.length) {
            if (["image/png", "image/jpg", "image/jpeg", "image/svg", "image/svg+xml"].includes(mime[1])) {
                valid = true;
            } else {
                throw new BadRequestException("Invalid image file, accepts png, jpg and svg");
            }
        } else {
            throw new BadRequestException("Invalid image file, accepts png, jpg and svg");
        }
    } else {
        valid = true;
    }
    return valid;
}


