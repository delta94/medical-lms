import {Module} from "@nestjs/common";
import {FbcRepository} from "@/bloods/fbc/fbc.repository";
import {FbcController} from "@/bloods/fbc/fbc.controller";
import {FbcService} from "@/bloods/fbc/fbc.service";

@Module({
    exports: [FbcRepository],
    controllers: [FbcController],
    providers: [FbcService, FbcRepository]
})
export class FbcModule {
}
