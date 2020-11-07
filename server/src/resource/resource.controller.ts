import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {ResourceService} from "@/resource/resource.service";
import {IsNotEmpty} from "class-validator";
import {Resource} from "@/resource/resource.entity";
import {getQueryRequest} from "@/FilteredQueryRequest";
import {PaginatedList} from "@/PaginatedList";
import {SuccessResult} from "@/SuccessResult";

export class CreateOrUpdateResourceModel {
    @IsNotEmpty()
    readonly name: string;
    @IsNotEmpty()
    readonly type: string;
    @IsNotEmpty()
    readonly html: string;
    @IsNotEmpty()
    readonly description: string;
}

@Controller("/api/v1/clients/:clientId/resources")
@UseGuards(AuthGuard('jwt'))
export class ResourceController {
    constructor(private readonly resourceService: ResourceService) {
    }

    @Post()
    async create(@Param("clientId", new ParseIntPipe()) clientId: number, @Body() model: CreateOrUpdateResourceModel): Promise<Resource> {
        return await this.resourceService.create(clientId, model.name, model.type, model.html, model.description);
    }

    @Get()
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Query() query: any): Promise<PaginatedList<Resource>> {
        return await this.resourceService.find(clientId, getQueryRequest(query));
    }

    @Get(":id")
    async findById(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number): Promise<Resource> {
        return await this.resourceService.findById(clientId, id);
    }

    @Put(":id")
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number, @Body() model: CreateOrUpdateResourceModel): Promise<Resource> {
        return await this.resourceService.update(clientId, id, model.name, model.type, model.html, model.description);
    }

    @Delete(":id")
    async delete(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number): Promise<SuccessResult> {
        let success = await this.resourceService.delete(clientId, id);
        return new SuccessResult(success);
    }
}
