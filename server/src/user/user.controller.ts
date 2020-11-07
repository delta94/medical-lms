import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {Role, User} from "./user.entity";
import {SuccessResult} from "@/SuccessResult";
import {IsBoolean, IsEmail, IsInt, IsNotEmpty} from "class-validator";
import {PaginatedList} from "@/PaginatedList";
import {getQueryRequest} from "@/FilteredQueryRequest";
import {AuthGuard} from "@nestjs/passport";

export class CreateOrUpdateUserModel {
    @IsNotEmpty()
    readonly name: string;
    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    @IsInt()
    readonly role: Role;
    @IsNotEmpty()
    @IsBoolean()
    readonly disabled: boolean;
}

@Controller("/api/v1/clients/:clientId/users")
@UseGuards(AuthGuard('jwt'))
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post()
    async create(@Param("clientId", new ParseIntPipe()) clientId: number, @Body() model: CreateOrUpdateUserModel): Promise<User> {
        return await this.userService.create(clientId, model.name, model.email, model.role, model.disabled);
    }

    @Get()
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Query() query: any): Promise<PaginatedList<User>> {
        return await this.userService.find(clientId, getQueryRequest(query));
    }

    @Get(":id")
    async findById(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number): Promise<User> {
        return await this.userService.findById(clientId, id);
    }

    @Put(":id")
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number, @Body() model: CreateOrUpdateUserModel): Promise<User> {
        return await this.userService.update(clientId, id, model.name, model.email, model.role, model.disabled);
    }

    @Delete(":id")
    async delete(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number): Promise<SuccessResult> {
        let success = await this.userService.delete(clientId, id);
        return new SuccessResult(success);
    }
}
