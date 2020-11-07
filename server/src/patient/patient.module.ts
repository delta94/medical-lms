import {Module} from "@nestjs/common";
import {PatientRepository} from "@/patient/patient.repository";
import {PatientController} from "@/patient/patient.controller";
import {PatientService} from "@/patient/patient.service";
import {PhysicalExamResultsRepository} from "@/physicalexamresults/physicalexamresults.repository";
import {PhysicalExamRegionRepository} from "@/physicalexamregions/physicalexamregion.repository";

@Module({
    exports:[PatientRepository],
    controllers:[PatientController],
    providers:[PatientService, PatientRepository, PhysicalExamResultsRepository, PhysicalExamRegionRepository]
})
export class PatientModule {}
