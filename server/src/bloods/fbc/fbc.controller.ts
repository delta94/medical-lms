import {IsNotEmpty} from "class-validator";
import {Body, Controller, Get, Param, ParseIntPipe, Put, Request, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {SuccessResult} from "@/SuccessResult";
import {FBC} from "@/bloods/fbc/fbc.entity";
import {FbcService} from "@/bloods/fbc/fbc.service";

export class CreateOrUpdateFBCModel {
    @IsNotEmpty()
    readonly hb: number;
    @IsNotEmpty()
    readonly mcv: number;
    @IsNotEmpty()
    readonly mch:number;
    @IsNotEmpty()
    readonly totalWcc: number;
    @IsNotEmpty()
    readonly neutrophils: number;
    @IsNotEmpty()
    readonly lymphocytes: number;
    @IsNotEmpty()
    readonly monocytes: number;
    @IsNotEmpty()
    readonly eosinophils: number;
    @IsNotEmpty()
    readonly platelets: number;

}

@Controller("/api/v1/clients/:clientId/patients/:patientId/bloods/fbc")
@UseGuards(AuthGuard('jwt'))
export class FbcController {
    constructor(private readonly fbcService: FbcService) {
    }


    @Get("")
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number): Promise<FBC> {
        return await this.fbcService.find(clientId, patientId);
    }

    @Put()
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number,  @Body() model: CreateOrUpdateFBCModel, @Request() request): Promise<SuccessResult> {
        let success = await this.fbcService.setFBCInfo(clientId, patientId, model.hb, model.mcv, model.mch, model.totalWcc, model.neutrophils, model.lymphocytes, model.monocytes, model.eosinophils, model.platelets );
        return new SuccessResult(success);
    }
}
