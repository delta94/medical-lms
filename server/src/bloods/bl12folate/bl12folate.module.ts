import {Module} from "@nestjs/common";
import {Bl12folateRepository} from "@/bloods/bl12folate/bl12folate.repository";
import {Bl12folateController} from "@/bloods/bl12folate/bl12folate.controller";
import {Bl12folateService} from "@/bloods/bl12folate/bl12folate.service";

@Module({
    exports: [Bl12folateRepository],
    controllers: [Bl12folateController],
    providers: [Bl12folateService, Bl12folateRepository]
})
export class Bl12folateModule {
}
