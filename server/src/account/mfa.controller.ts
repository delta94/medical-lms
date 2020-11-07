import {Body, Controller, Get, Post, Put, Query, Request, UseGuards} from "@nestjs/common";
import AccountService from "./account.service";
import {AuthGuard} from "@nestjs/passport";
import {IsEmail, IsNotEmpty} from "class-validator";
import MfaService from "@/account/mfa.service";
import TotpService from "@/account/totp.service";
import FidoService from "@/account/fido.service";
import {SuccessResult} from "@/SuccessResult";

export class RecoveryVerificationModel {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    readonly code: string;
}

@Controller("/api/v1/account/mfa")
export class MfaController {
    constructor(
        private readonly accountService: AccountService,
        private readonly mfaService: MfaService,
        private readonly totpService: TotpService,
        private readonly fidoService: FidoService) {}

    @Get("enabled")
    @UseGuards(AuthGuard("jwt"))
    async isMfaSetup(@Request() req): Promise<{ enabled: boolean }> {
        let enabled = await this.mfaService.isMfaSetup(req.clientId, req.user.id);
        return {enabled}
    }

    @Get("recovery-codes")
    @UseGuards(AuthGuard("jwt"))
    async findRecoveryCodes(@Request() req): Promise<string[]> {
        return await this.mfaService.findRecoveryCodes(req.user.id);
    }

    @Post("recovery-codes")
    @UseGuards(AuthGuard("jwt"))
    async generateMfaRecoveryCodes(@Request() req, @Query() query: any): Promise<SuccessResult> {
        await this.mfaService.generateMfaRecoveryCodes(req.clientId, req.user.id, query.regenerate);
        return new SuccessResult();
    }

    @Put("disable")
    @UseGuards(AuthGuard("jwt"))
    async disableMfa(@Request() req): Promise<SuccessResult> {
        let success = await this.mfaService.disableMfa(req.clientId, req.user.id);
        return new SuccessResult(success);
    }

    //TOTP
    @Get("totp/setup")
    @UseGuards(AuthGuard("jwt"))
    async getTotpSetup(@Request() req): Promise<any> {
        if (req.mfaEnabled)
            return {success: false, mfaEnabled: true};
        return await this.totpService.generateTotpSetup(req.user.email);
    }

    @UseGuards(AuthGuard("jwt"), AuthGuard("totp"))
    @Post("totp/setup")
    async verifyTotpSetup(@Request() req): Promise<SuccessResult> {
        await this.totpService.verifyTotpSetup(req.clientId, req.user.id);
        return new SuccessResult();
    }
}
