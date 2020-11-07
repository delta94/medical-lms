import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {IsBoolean, IsNotEmpty, IsNumber} from "class-validator";
import {PatientService} from "@/patient/patient.service";
import {Patient} from "@/patient/patient.entity";
import {PaginatedList} from "@/PaginatedList";
import {getQueryRequest} from "@/FilteredQueryRequest";
import {SuccessResult} from "@/SuccessResult";

export class CreateOrUpdatePatientModel {
    @IsNotEmpty()
    readonly name: string;
    @IsNotEmpty()
    @IsNumber()
    readonly age: number;
    @IsNotEmpty()
    @IsBoolean()
    readonly isFemale: boolean;
    @IsNotEmpty()
    readonly description: string;
    @IsNotEmpty()
    @IsNumber()
    readonly height: number;
    @IsNotEmpty()
    @IsNumber()
    readonly weight: number;
    @IsNotEmpty()
    readonly ethnicity: string;
}

@Controller("/api/v1/clients/:clientId/patients")
@UseGuards(AuthGuard('jwt'))
export class PatientController {
    constructor(private readonly patientService: PatientService) {
    }

    @Post()
    async create(@Param("clientId", new ParseIntPipe()) clientId: number, @Body() model: CreateOrUpdatePatientModel): Promise<Patient> {
        return await this.patientService.create(clientId, model.name, model.age, model.isFemale, model.description, model.height, model.weight, model.ethnicity);
    }

    @Get()
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Query() query: any): Promise<PaginatedList<Patient>> {
        return await this.patientService.find(clientId, getQueryRequest(query));
    }

    @Get(":id")
    async findById(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number): Promise<Patient> {
        let patient = await this.patientService.findById(clientId, id);
        if (patient) return patient;
        throw new NotFoundException();
    }

    @Put(":id")
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number, @Body() model: CreateOrUpdatePatientModel): Promise<Patient> {
        return await this.patientService.update(clientId, id, model.name, model.age, model.isFemale, model.description, model.height, model.weight, model.ethnicity);
    }

    @Delete(":id")
    async delete(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number): Promise<SuccessResult> {
        let success = await this.patientService.delete(clientId, id);

        return new SuccessResult(success);
    }
}
