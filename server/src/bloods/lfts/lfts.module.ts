import {Module} from "@nestjs/common";
import {LftsRepository} from "@/bloods/lfts/lfts.repository";
import {LftsController} from "@/bloods/lfts/lfts.controller";
import {LftsService} from "@/bloods/lfts/lfts.service";

@Module({
    exports: [LftsRepository],
    controllers: [LftsController],
    providers: [LftsService, LftsRepository]
})
export class LftsModule {
}
