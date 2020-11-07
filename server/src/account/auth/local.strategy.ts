import {ForbiddenException, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import AccountService, {LoginError} from "../account.service";
import {ClientRepository} from "@/client/client.repository";
import {FeatureService} from "@/feature/feature.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly accountService: AccountService,
        private readonly clientRepository: ClientRepository,
        private readonly featureService: FeatureService
    ) {
        super({
            usernameField: "email",
            passReqToCallback: true
        });
    }

    async validate(req: any, email: string, password: string): Promise<any> {
        const clientId = req.clientId;
        const {loginError, user} = await this.accountService.getUserIfValidCredentials(clientId, email, password);

        let clientDisabled = false;
        if (user !== null) {
            let client = await this.clientRepository.findById(clientId);
            if (client.disabled) {
                clientDisabled = true;
            }
        }

        let mfaEnabled = await this.featureService.isEnabled(clientId, "mfa");
        let totpEnabled = await this.featureService.isEnabled(clientId, "mfa-totp");
        let fidoEnabled = await this.featureService.isEnabled(clientId, "mfa-fido");

        let mfaShouldBeUsed = mfaEnabled && totpEnabled || mfaEnabled && fidoEnabled;

        switch (loginError) {
            case LoginError.UserNonExistent:
                throw new NotFoundException();
            case LoginError.IncorrectPassword:
                throw new UnauthorizedException("Incorrect Password");
            case LoginError.UserDisabled:
                throw new ForbiddenException();
            case LoginError.UserNotActivated:
                throw new UnauthorizedException("User not activated");
            case LoginError.None:
                if (clientDisabled)
                    throw new ForbiddenException();
                return {
                    id: user.id,
                    clientId: user.clientId,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    mfaEnabled: mfaShouldBeUsed ? user.mfaEnabled : false
                };
            default:
                throw new UnauthorizedException("Unknown error");
        }
    }
}