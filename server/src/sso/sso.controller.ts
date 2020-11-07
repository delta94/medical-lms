import {IsNotEmpty, IsUrl} from "class-validator";
import {Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, Request, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {SsoService} from "@/sso/sso.service";
import {SSO} from "@/sso/sso.entity";
import {SuccessResult} from "@/SuccessResult";

export class CreateOrUpdateSSOModel {
    @IsNotEmpty()
    @IsUrl()
    readonly endpoint: string;
    @IsNotEmpty()
    readonly certificate: string;
}

@Controller("/api/v1/clients/:clientId/settings/sso")
@UseGuards(AuthGuard('jwt'))
export class SsoController {
    constructor(private readonly ssoService: SsoService) {
    }

    @Get()
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Query() query: any): Promise<SSO> {
        return await this.ssoService.find(clientId);
    }

    @Put()
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Body() model: CreateOrUpdateSSOModel, @Request() request): Promise<SuccessResult> {
        let success = await this.ssoService.setSSOSettings(clientId, model.endpoint, model.certificate);
        return new SuccessResult(success);
    }
}
