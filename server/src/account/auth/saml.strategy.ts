import {ForbiddenException, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import AccountService, {SamlLoginError} from "../account.service";
import * as MultiSamlStrategy from "passport-saml/multiSamlStrategy";
import {SamlOptionsCallback} from "passport-saml/multiSamlStrategy";
import {Profile, SamlConfig} from "passport-saml";
import {FeatureFlags, FeatureService} from "@/feature/feature.service";
import {SsoRepository} from "@/sso/sso.repository";
import {ClientRepository} from "@/client/client.repository";

@Injectable()
export class SamlStrategy extends PassportStrategy(MultiSamlStrategy) {
    constructor(
        private readonly accountService: AccountService,
        private readonly featureService: FeatureService,
        private readonly ssoRepository: SsoRepository,
        private readonly clientRepository: ClientRepository) {
        super({
            passReqToCallback: true,
            authnRequestBinding: "HTTP-POST",
            getSamlOptions: (request: any, done: SamlOptionsCallback) => {
                let clientId = request.clientId ?? +request.body.RelayState;
                clientRepository.findSubdomainById(clientId)
                    .then(subdomain => {
                        this.featureService.isEnabled(clientId, FeatureFlags.samlSSO)
                            .then(enabled => {
                                if (enabled) {
                                    this.ssoRepository.find(clientId)
                                        .then(configuration => {
                                            let config: SamlConfig = {
                                                callbackUrl: `http${(process.env.REQUIRE_HTTPS === "true" ?? false) ? "s" : ""}://${subdomain}.${process.env.SERVER_DOMAIN ?? "localhost:4000"}/api/v1/account/login/saml`,
                                                entryPoint: configuration.endpoint,
                                                cert: configuration.certificate,
                                                additionalParams: {
                                                    RelayState: clientId
                                                }
                                            }

                                            done(null, config);
                                        })
                                        .catch(err => {
                                            done(err, null);
                                        });
                                } else {
                                    done(new UnauthorizedException(), null);
                                }
                            })
                            .catch(err => {
                                done(err, null);
                            });
                    })
                    .catch(err => {
                        done(err, null);
                    });
            }
        });
    }

    async validate(req: any, profile: Profile): Promise<any> {
        let clientId = req.clientId ?? +req.body.RelayState;
        let {loginError, user} = await this.accountService.getUserIfValidSamlResponse(clientId, profile);
        switch (loginError) {
            case SamlLoginError.UserNonExistent:
                throw new NotFoundException();
            case SamlLoginError.UserNotIdentified:
                throw new UnauthorizedException("Incorrect Password");
            case SamlLoginError.UserDisabled || SamlLoginError.UserNotSso || SamlLoginError.UserNotIdentified || SamlLoginError.UserNotIdentified:
                throw new ForbiddenException();
            case SamlLoginError.None: {
                if (user == null)
                    user = await this.accountService.provisionNewSamlUser(clientId, profile);
                return user;
            }
            default:
                throw new UnauthorizedException("Unknown error");
        }
    }
}