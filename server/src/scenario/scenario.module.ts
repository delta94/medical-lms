import {Module} from "@nestjs/common";
import {ScenarioRepository} from "@/scenario/scenario.repository";
import {ScenarioController} from "@/scenario/scenario.controller";
import {ScenarioService} from "@/scenario/scenario.service";
import {EnvironmentModule} from "@/scenario/environment/environment.module";
import {PatientRepository} from "@/patient/patient.repository";
import {ScenarioSpeakerRepository} from "@/scenario-speakers/scenariospeaker.repository";

@Module({
    imports: [EnvironmentModule],
    exports: [ScenarioRepository],
    controllers: [ScenarioController],
    providers: [ScenarioService, ScenarioRepository, PatientRepository, ScenarioSpeakerRepository]
})
export class ScenarioModule {
}
