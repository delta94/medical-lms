import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {AccountRepository} from "@/account/account.repository";
import {Strategy} from "passport-totp/lib";
import MfaService from "@/account/mfa.service";
import {FeatureService} from "@/feature/feature.service";

@Injectable()
export class TotpStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly mfaService: MfaService,
        private readonly featureService: FeatureService) {
        super({window: 1}, (user: any, done: Function) => {
            this.accountRepository.findSecretByUserId(user.id)
                .then(secret => {
                    if (!secret)
                        return done(new Error("No secret"), null);
                    return done(null, secret, 30);
                });
        });
    }

    async authenticate(req, other) {
        let mfaEnabled = await this.featureService.isEnabled(req.clientId, "mfa");
        let totpEnabled = await this.featureService.isEnabled(req.clientId, "mfa-totp");
        if (mfaEnabled && totpEnabled) {
            let rc = req.body.recoveryCode;
            if (rc && rc.trim() !== "") {
                let valid = await this.mfaService.verifyRecoveryCode(req.body.email, rc);
                if (valid)
                    this.success(req.user);
                else this.fail();

            } else {
                await super.authenticate(req, other);
            }
        } else {
            this.success(req.user);
        }
    }
}