import {IsNotEmpty} from "class-validator";
import {Body, Controller, Get, Param, ParseIntPipe, Put, Request, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {SuccessResult} from "@/SuccessResult";
import {CoagulationService} from "@/bloods/coagulation/coagulation.service";
import {Coagulation} from "@/bloods/coagulation/coagulation.entity";

export class CreateOrUpdateCoagulationModel {
    @IsNotEmpty()
    readonly pt: number;
    @IsNotEmpty()
    readonly aptt: number;
    @IsNotEmpty()
    readonly fibrinogen:number;

}

@Controller("/api/v1/clients/:clientId/patients/:patientId/bloods/coagulation")
@UseGuards(AuthGuard('jwt'))
export class CoagulationController {
    constructor(private readonly coagulationService: CoagulationService) {
    }


    @Get("")
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number): Promise<Coagulation> {
        return await this.coagulationService.find(clientId, patientId);
    }

    @Put()
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number,  @Body() model: CreateOrUpdateCoagulationModel, @Request() request): Promise<SuccessResult> {
        let success = await this.coagulationService.setCoagulationInfo(clientId, patientId, model.pt, model.aptt, model.fibrinogen);
        return new SuccessResult(success);
    }
}
