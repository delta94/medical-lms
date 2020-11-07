import {Module} from "@nestjs/common";
import {CoagulationRepository} from "@/bloods/coagulation/coagulation.repository";
import {CoagulationController} from "@/bloods/coagulation/coagulation.controller";
import {CoagulationService} from "@/bloods/coagulation/coagulation.service";

@Module({
    exports: [CoagulationRepository],
    controllers: [CoagulationController],
    providers: [CoagulationService, CoagulationRepository]
})
export class CoagulationModule {
}
