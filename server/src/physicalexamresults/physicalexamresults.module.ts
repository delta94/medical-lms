import {Module} from "@nestjs/common";
import {PhysicalExamResultsRepository} from "@/physicalexamresults/physicalexamresults.repository";
import {PhysicalExamResultsController} from "@/physicalexamresults/physicalexamresults.controller";
import {PhysicalExamResultsService} from "@/physicalexamresults/physicalexamresults.service";

@Module({
    exports:[PhysicalExamResultsRepository],
    controllers:[PhysicalExamResultsController],
    providers:[PhysicalExamResultsService, PhysicalExamResultsRepository]
})
export class PhysicalExamResultsModule {}
