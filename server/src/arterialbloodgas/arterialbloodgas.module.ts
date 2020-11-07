import {Module} from "@nestjs/common";
import {ArterialBloodGasRepository} from "@/arterialbloodgas/arterialbloodgas.repository";
import {ArterialBloodGasController} from "@/arterialbloodgas/arterialbloodgas.controller";
import {ArterialBloodGasService} from "@/arterialbloodgas/arterialbloodgas.service";

@Module({
    exports: [ArterialBloodGasRepository],
    controllers: [ArterialBloodGasController],
    providers: [ArterialBloodGasService, ArterialBloodGasRepository]
})
export class ArterialBloodGasModule {
}
