import {Module} from "@nestjs/common";
import {ScenarioSpeakerRepository} from "@/scenario-speakers/scenariospeaker.repository";
import {ScenarioSpeakerController} from "@/scenario-speakers/scenariospeaker.controller";
import {ScenarioSpeakerService} from "@/scenario-speakers/scenariospeaker.service";

@Module({
    exports: [ScenarioSpeakerRepository],
    controllers: [ScenarioSpeakerController],
    providers: [ScenarioSpeakerService, ScenarioSpeakerRepository]
})
export class ScenarioSpeakerModule {
}
