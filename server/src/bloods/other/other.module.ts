import {Module} from "@nestjs/common";
import {OtherRepository} from "@/bloods/other/other.repository";
import {OtherController} from "@/bloods/other/other.controller";
import {OtherService} from "@/bloods/other/other.service";

@Module({
    exports: [OtherRepository],
    controllers: [OtherController],
    providers: [OtherService, OtherRepository]
})
export class OtherModule {
}
