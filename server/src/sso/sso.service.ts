import {ForbiddenException, Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {SsoRepository} from "@/sso/sso.repository";
import {SSO} from "@/sso/sso.entity";
import {Role} from "@/user/user.entity";
import {FeatureFlags, FeatureService} from "@/feature/feature.service";

@Injectable({scope: Scope.REQUEST})
export class SsoService {
    constructor(
        private readonly ssoRepository: SsoRepository,
        private readonly featureService: FeatureService,
        @Inject(REQUEST) private readonly request: any) {
    }

    async find(clientId: number): Promise<SSO | null> {
        this.authorise(clientId);

        if (!await this.featureService.isEnabled(clientId, FeatureFlags.samlSSO)) {
            throw new ForbiddenException();
        }

        return await this.ssoRepository.find(clientId);
    }

    async setSSOSettings(clientId: number, endpoint: string, certificate: string): Promise<boolean> {
        this.authorise(clientId);

        if (!await this.featureService.isEnabled(clientId, FeatureFlags.samlSSO)) {
            throw new ForbiddenException();
        }
        return await this.ssoRepository.setSSOSettings(clientId, endpoint, certificate);
    }

    authorise(clientId: number): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < Role.SuperUser)
            throw new UnauthorizedException();
    }
}
