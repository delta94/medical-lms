import {IsNotEmpty} from "class-validator";
import {Body, Controller, Get, Param, ParseIntPipe, Put, Request, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {SuccessResult} from "@/SuccessResult";
import {LftsService} from "@/bloods/lfts/lfts.service";
import {LFTS} from "@/bloods/lfts/lfts.entity";

export class CreateOrUpdateLFTSModel {
    @IsNotEmpty()
    readonly alp: number;
    @IsNotEmpty()
    readonly alt: number;
    @IsNotEmpty()
    readonly bilirubin:number;
    @IsNotEmpty()
    readonly albumin: number;

}

@Controller("/api/v1/clients/:clientId/patients/:patientId/bloods/lfts")
@UseGuards(AuthGuard('jwt'))
export class LftsController {
    constructor(private readonly lftsService: LftsService) {
    }


    @Get("")
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number): Promise<LFTS> {
        return await this.lftsService.find(clientId, patientId);
    }

    @Put()
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number,  @Body() model: CreateOrUpdateLFTSModel, @Request() request): Promise<SuccessResult> {
        let success = await this.lftsService.setLFTSInfo(clientId, patientId, model.alp, model.alt, model.bilirubin, model.albumin);
        return new SuccessResult(success);
    }
}
