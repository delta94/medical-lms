import {forwardRef, Module} from '@nestjs/common';
import {AccountController} from "@/account/account.controller";
import AccountService from "@/account/account.service";
import {AccountRepository} from "@/account/account.repository";
import {UserModule} from "@/user/user.module";
import {LocalStrategy} from "@/account/auth/local.strategy";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "@/account/auth/consts";
import {JwtStrategy} from "@/account/auth/jwt.strategy";
import {ClientModule} from "@/client/client.module";
import {SamlStrategy} from "@/account/auth/saml.strategy";
import {SsoModule} from "@/sso/sso.module";
import FidoService from "@/account/fido.service";
import MfaService from "@/account/mfa.service";
import TotpService from "@/account/totp.service";
import {TotpStrategy} from "@/account/auth/totp.strategy";
import {MfaController} from "@/account/mfa.controller";

@Module({
    imports: [
        forwardRef(() => UserModule),
        PassportModule,
        SsoModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {expiresIn: "24h"}
        }),
        ClientModule
    ],
    exports: [AccountRepository],
    controllers: [AccountController, MfaController],
    providers: [AccountService, AccountRepository, FidoService, MfaService, TotpService, LocalStrategy, JwtStrategy, SamlStrategy, TotpStrategy]
})
export class AccountModule {
}
