import {Module} from "@nestjs/common";
import {ScenarioDecisionRepository} from "@/scenario-decisions/scenario-decision.repository";
import {ScenarioDecisionController} from "@/scenario-decisions/scenario-decision.controller";
import {ScenarioDecisionService} from "@/scenario-decisions/scenario-decision.service";

@Module({
    exports: [ScenarioDecisionRepository],
    controllers: [ScenarioDecisionController],
    providers: [ScenarioDecisionService, ScenarioDecisionRepository]
})
export class ScenarioDecisionModule {
}
