import {Module} from "@nestjs/common";
import {EnvironmentRepository} from "@/scenario/environment/environment.repository";
import {EnvironmentService} from "@/scenario/environment/environment.service";
import {EnvironmentController} from "@/scenario/environment/environment.controller";

@Module({
    exports: [EnvironmentRepository],
    controllers: [EnvironmentController],
    providers: [EnvironmentService, EnvironmentRepository]
})
export class EnvironmentModule {
}
