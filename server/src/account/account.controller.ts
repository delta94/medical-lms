import {Body, Controller, Get, Post, Put, Request, Response, UseGuards} from "@nestjs/common";
import AccountService from "./account.service";
import {AuthGuard} from "@nestjs/passport";
import {SuccessResult} from "@/SuccessResult";
import {IsNotEmpty, MinLength} from "class-validator";
import {WeakPasswordException} from "@/account/auth/password-policy";
import {FeatureService} from "@/feature/feature.service";
import {ClientService} from "@/client/client.service";
import {Client} from "@/client/client.entity";

export class SetLanguageModel {
    @IsNotEmpty()
    readonly language: string;
}

export class ChangePasswordModel {
    @IsNotEmpty()
    readonly currentPassword: string;
    @IsNotEmpty()
    @MinLength(8)
    readonly newPassword: string;
}

@Controller("/api/v1/account")
export class AccountController {
    constructor(
        private readonly accountService: AccountService,
        private readonly featureService: FeatureService,
        private readonly clientService: ClientService) {}

    @Get("features")
    async getEnabledFeatures(@Request() req: any): Promise<string[]> {
        let globalFeatureFlags = this.featureService.getFeatureFlagsForSystem();
        let featureKeys = Array.from(globalFeatureFlags.keys());

        let result: string[] = [];
        for (let f of featureKeys) {
            if (await this.featureService.isEnabled(req.clientId, f) === true) {
                result.push(f);
            }
        }
        return result;
    }

    @UseGuards(AuthGuard("local"))
    @Post("login")
    async localLogin(@Request() req): Promise<any> {
        if (req.user.mfaEnabled) {
            return {
                success: true,
                mfaEnabled: true
            }
        } else {
            return this.accountService.login(req.user);
        }
    }

    @UseGuards(AuthGuard("local"), AuthGuard("totp"))
    @Post("login/two-factor/totp")
    async totpMfaLogin(@Request() req): Promise<any> {
        return this.accountService.login(req.user);
    }

    @UseGuards(AuthGuard("saml"))
    @Get("login/saml")
    async getSamlLogin(@Request() req): Promise<any> {
        return null;
    }

    @UseGuards(AuthGuard("saml"))
    @Post("login/saml")
    async samlLogin(@Request() req, @Response() response): Promise<any> {
        let data = await this.accountService.samlLogin(req.user);
        return response.redirect(303, `http${(process.env.REQUIRE_HTTPS === "true" ?? false) ? "s" : ""}://${data.subdomain}.${process.env.BASE_DOMAIN ?? "localhost:3000"}/account/login/saml?access_token=${data.access_token}`);
    }

    @UseGuards(AuthGuard("jwt"))
    @Post("language")
    async setLanguage(@Request() req, @Body() model: SetLanguageModel): Promise<SuccessResult> {
        let success = await this.accountService.setLanguage(req.clientId, req.user.id, model.language);
        return new SuccessResult(success);
    }

    @UseGuards(AuthGuard("jwt"))
    @Put("password")
    async changePassword(@Request() req, @Body() model: ChangePasswordModel): Promise<any> {
        try {
            const success = await this.accountService.changePassword(req.clientId, req.user.id, req.user.email, model.currentPassword, model.newPassword);
            return new SuccessResult(success);
        } catch (e) {
            if (e instanceof WeakPasswordException)
                return {success: false, weakpassword: true};
            else
                throw e;
        }
    }

    @Get("client")
    async getClient(@Request() req): Promise<Client> {
        return await this.clientService.findById(req.clientId);
    }
}
