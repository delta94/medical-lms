import {Module} from "@nestjs/common";
import {ResourceRepository} from "@/resource/resource.repository";
import {ResourceController} from "@/resource/resource.controller";
import {ResourceService} from "@/resource/resource.service";

@Module({
    exports:[ResourceRepository],
    controllers:[ResourceController],
    providers:[ResourceService, ResourceRepository]
})
export class ResourceModule {}
