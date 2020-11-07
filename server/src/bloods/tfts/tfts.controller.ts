import {IsNotEmpty} from "class-validator";
import {Body, Controller, Get, Param, ParseIntPipe, Put, Request, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {SuccessResult} from "@/SuccessResult";
import {CoagulationService} from "@/bloods/coagulation/coagulation.service";
import {Coagulation} from "@/bloods/coagulation/coagulation.entity";
import {TftsService} from "@/bloods/tfts/tfts.service";
import {TFTS} from "@/bloods/tfts/tfts.entity";

export class CreateOrUpdateTFTSModel {
    @IsNotEmpty()
    readonly tsh: number;
    @IsNotEmpty()
    readonly freeT4: number;
    @IsNotEmpty()
    readonly freeT3:number;

}

@Controller("/api/v1/clients/:clientId/patients/:patientId/bloods/tfts")
@UseGuards(AuthGuard('jwt'))
export class TftsController {
    constructor(private readonly tftsService: TftsService) {
    }


    @Get("")
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number): Promise<TFTS> {
        return await this.tftsService.find(clientId, patientId);
    }

    @Put()
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number,  @Body() model: CreateOrUpdateTFTSModel, @Request() request): Promise<SuccessResult> {
        let success = await this.tftsService.setTFTSInfo(clientId, patientId, model.tsh, model.freeT4, model.freeT3);
        return new SuccessResult(success);
    }
}
