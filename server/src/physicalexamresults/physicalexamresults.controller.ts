import {IsNotEmpty} from "class-validator";
import {Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {PhysicalExamResultsService} from "@/physicalexamresults/physicalexamresults.service";
import {PhysicalExamResults} from "@/physicalexamresults/physicalexamresults.entity";
import {PaginatedList} from "@/PaginatedList";
import {getQueryRequest} from "@/FilteredQueryRequest";

export class CreateOrUpdatePhysicalExamResultsModel {
    @IsNotEmpty()
    readonly regionId: number;
    @IsNotEmpty()
    readonly result: string;
    @IsNotEmpty()
    readonly appropriate: boolean;
}

@Controller("/api/v1/clients/:clientId/patients/:patientId/physicalexam/results")
@UseGuards(AuthGuard('jwt'))
export class PhysicalExamResultsController {
    constructor(private readonly examResultsService: PhysicalExamResultsService) {
    }

    @Post()
    async create(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number, @Body() model: CreateOrUpdatePhysicalExamResultsModel): Promise<PhysicalExamResults> {
        return await this.examResultsService.create(clientId, patientId, model.regionId, model.result, model.appropriate);
    }

    @Get()
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number, @Query() query: any): Promise<PaginatedList<PhysicalExamResults>> {
        return await this.examResultsService.find(clientId, patientId, getQueryRequest(query));
    }

    @Get(":id")
    async findById(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number, @Param("id", new ParseIntPipe()) id: number): Promise<PhysicalExamResults> {
        return await this.examResultsService.findById(clientId, patientId, id);
    }

    @Put(":id")
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number, @Param("id", new ParseIntPipe()) id: number, @Body() model: CreateOrUpdatePhysicalExamResultsModel): Promise<PhysicalExamResults> {
        return await this.examResultsService.update(clientId, patientId, id, model.regionId, model.result, model.appropriate);
    }
}
