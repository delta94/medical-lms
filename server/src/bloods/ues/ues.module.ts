import {Module} from "@nestjs/common";
import {UesRepository} from "@/bloods/ues/ues.repository";
import {UesController} from "./ues.controller";
import {UesService} from "@/bloods/ues/ues.service";

@Module({
    exports: [UesRepository],
    controllers: [UesController],
    providers: [UesService, UesRepository]
})
export class UesModule {
}
