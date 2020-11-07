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
} from '@nestjs/common';
import {ClientService} from "./client.service";
import {Client} from "./client.entity";
import {AuthGuard} from "@nestjs/passport";
import {IsBoolean, IsNotEmpty} from "class-validator";
import {SuccessResult} from "@/SuccessResult";
import {getQueryRequest} from "@/FilteredQueryRequest";
import {PaginatedList} from "@/PaginatedList";
import {validateImage} from "@/scenario/scenario.controller";

export class CreateOrUpdateClientModel {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    @IsBoolean()
    disabled: boolean;
    @IsNotEmpty()
    subdomain: string;
    logo: string;
}

@Controller("/api/v1/clients")
@UseGuards(AuthGuard('jwt'))
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Post()
    async create(@Body() model: CreateOrUpdateClientModel): Promise<Client> {
        return await this.clientService.create(model.name, model.disabled, model.subdomain);
    }

    @Get()
    async find(@Query() query: any): Promise<PaginatedList<Client>> {
        return await this.clientService.find(getQueryRequest(query));
    }

    @Get(":id")
    async findById(@Param("id", new ParseIntPipe()) id: number): Promise<Client> {
        return await this.clientService.findById(id);
    }

    @Put(":id")
    async update(@Param("id", new ParseIntPipe()) id: number, @Body() model: CreateOrUpdateClientModel): Promise<Client> {
        if (validateImage(model.logo))
            return await this.clientService.update(id, model.name, model.disabled, model.subdomain, model.logo);
    }

    @Delete(":id")
    async delete(@Param("id", new ParseIntPipe()) id: number): Promise<SuccessResult> {
        let success = await this.clientService.delete(id);
        return new SuccessResult(success);
    }
}
