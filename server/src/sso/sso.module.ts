import {Module} from "@nestjs/common";
import {SsoRepository} from "@/sso/sso.repository";
import {SsoController} from "@/sso/sso.controller";
import {SsoService} from "@/sso/sso.service";

@Module({
    exports: [SsoRepository],
    controllers: [SsoController],
    providers: [SsoService, SsoRepository]
})
export class SsoModule {
}
