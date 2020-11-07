import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {SuccessResult} from "@/SuccessResult";
import {IsInt, IsNotEmpty} from "class-validator";
import {GroupService} from "@/group/group.service";
import {Group} from "@/group/group.entity";
import {User} from "@/user/user.entity";
import {getQueryRequest, QueryRequest} from "@/FilteredQueryRequest";
import {PaginatedList} from "@/PaginatedList";

export class CreateOrUpdateGroupModel {
    @IsNotEmpty()
    readonly name: string;
}

export class AddMemberModel {
    @IsNotEmpty()
    @IsInt()
    readonly userId: number;
}

export class AddChildGroupModel {
    @IsNotEmpty()
    @IsInt()
    readonly childGroupId: number;
}

@Controller("/api/v1/clients/:clientId/groups")
@UseGuards(AuthGuard('jwt'))
export class GroupController {
    constructor(private readonly groupService: GroupService) {}

    @Post()
    async create(@Param("clientId", new ParseIntPipe()) clientId: number, @Body() model: CreateOrUpdateGroupModel): Promise<Group> {
        return await this.groupService.create(clientId, model.name);
    }

    @Get()
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Query() query: any): Promise<PaginatedList<Group>> {
        return await this.groupService.find(clientId, getQueryRequest(query));
    }

    @Get(":id")
    async findById(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number): Promise<Group> {
        return await this.groupService.findById(clientId, id);
    }

    @Put(":id")
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number, @Body() model: CreateOrUpdateGroupModel): Promise<Group> {
        return await this.groupService.update(clientId, id, model.name);
    }

    @Delete(":id")
    async delete(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number): Promise<SuccessResult> {
        let success = await this.groupService.delete(clientId, id);
        return new SuccessResult(success);
    }

    @Get(":id/members")
    async findMembers(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number, @Query() query: any): Promise<PaginatedList<User>> {
        return await this.groupService.findMembers(clientId, id, getQueryRequest(query));
    }

    @Post(":groupId/members")
    async addMember(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("groupId", new ParseIntPipe()) groupId: number, @Body() model: AddMemberModel): Promise<SuccessResult> {
        let success = await this.groupService.addMember(clientId, groupId, model.userId);
        return new SuccessResult(success);
    }

    @Delete(":groupId/members/:userId")
    async removeMember(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("groupId", new ParseIntPipe()) groupId: number, @Param("userId", new ParseIntPipe()) userId: number): Promise<SuccessResult> {
        let success = await this.groupService.removeMember(clientId, groupId, userId);
        return new SuccessResult(success);
    }

    @Get(":id/children")
    async findChildGroups(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number, @Query() query: any): Promise<PaginatedList<Group>> {
        return await this.groupService.findChildGroups(clientId, id, getQueryRequest(query));
    }

    @Post(":id/children")
    async addChildGroup(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number, @Body() model: AddChildGroupModel): Promise<SuccessResult> {
        let success = await this.groupService.addChildGroup(clientId, id, model.childGroupId);
        return new SuccessResult(success);
    }

    @Delete(":id/children/:childGroupId")
    async removeChildGroup(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("id", new ParseIntPipe()) id: number, @Param("childGroupId", new ParseIntPipe()) childGroupId: number): Promise<SuccessResult> {
        let success = await this.groupService.removeChildGroup(clientId, id, childGroupId);
        return new SuccessResult(success);
    }
}
