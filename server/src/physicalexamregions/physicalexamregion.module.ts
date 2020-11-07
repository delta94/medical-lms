import {Module} from "@nestjs/common";
import {PhysicalExamRegionRepository} from "@/physicalexamregions/physicalexamregion.repository";
import {PhysicalExamRegionController} from "@/physicalexamregions/physicalexamregion.controller";
import {PhysicalExamRegionService} from "@/physicalexamregions/physicalexamregion.service";

@Module({
    exports:[PhysicalExamRegionRepository],
    controllers:[PhysicalExamRegionController],
    providers:[PhysicalExamRegionService, PhysicalExamRegionRepository]
})
export class PhysicalExamRegionModule {}
