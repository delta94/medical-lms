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
import {EnvironmentService} from "@/scenario/environment/environment.service";
import {Environment} from "@/scenario/environment/environment.entity";

export class CreateOrUpdateEnvironmentModel {
    @IsNotEmpty()
    readonly name: string;
    @IsNotEmpty()
    readonly image: string;

}

export class AddPatientModel {
    @IsNotEmpty()
    @IsInt()
    readonly patientId: number;
}

@Controller("/api/v1/clients/:clientId/scenarios/:scenarioId/environments")
@UseGuards(AuthGuard('jwt'))
export class EnvironmentController {
    constructor(private readonly environmentService: EnvironmentService) {
    }

    @Post()
    async create(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("scenarioId", new ParseIntPipe()) scenarioId: number, @Body() model: CreateOrUpdateEnvironmentModel): Promise<Environment> {
        if (validateImage(model.image))
            return await this.environmentService.create(clientId, scenarioId, model.name, model.image);
    }

    @Get()
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("scenarioId", new ParseIntPipe()) scenarioId: number, @Query() query: any): Promise<PaginatedList<Environment>> {
        return await this.environmentService.find(clientId, scenarioId, getQueryRequest(query));
    }

    @Get(":id")
    async findById(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("scenarioId", new ParseIntPipe()) scenarioId: number, @Param("id", new ParseIntPipe()) id: number): Promise<Environment> {
        return await this.environmentService.findById(clientId, scenarioId, id);
    }

    @Put(":id")
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("scenarioId", new ParseIntPipe()) scenarioId: number, @Param("id", new ParseIntPipe()) id: number, @Body() model: CreateOrUpdateEnvironmentModel): Promise<Environment> {
        if (validateImage(model.image))
            return await this.environmentService.update(clientId, scenarioId, id, model.name, model.image);
    }

    @Delete(":id")
    async delete(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("scenarioId", new ParseIntPipe()) scenarioId: number, @Param("id", new ParseIntPipe()) id: number): Promise<SuccessResult> {
        let success = await this.environmentService.delete(clientId, scenarioId, id);

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
        valid = false;
    }
    return valid;
}


