import {Module} from "@nestjs/common";
import {TftsRepository} from "@/bloods/tfts/tfts.repository";
import {TftsController} from "@/bloods/tfts/tfts.controller";
import {TftsService} from "@/bloods/tfts/tfts.service";

@Module({
    exports: [TftsRepository],
    controllers: [TftsController],
    providers: [TftsService, TftsRepository]
})
export class TftsModule {
}
