import {IsNotEmpty} from "class-validator";
import {Body, Controller, Get, Param, ParseIntPipe, Put, Request, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {SuccessResult} from "@/SuccessResult";
import {OtherService} from "@/bloods/other/other.service";
import {Other} from "@/bloods/other/other.entity";

export class CreateOrUpdateOtherModel {
    @IsNotEmpty()
    readonly magnesium: number;
    @IsNotEmpty()
    readonly amylase: number;
    @IsNotEmpty()
    readonly crp: number;
    @IsNotEmpty()
    readonly haematinicsFerritin: number;
    @IsNotEmpty()
    readonly troponinI: number;
    @IsNotEmpty()
    readonly hba1c: number;
    @IsNotEmpty()
    readonly lactate: number;
}
@Controller("/api/v1/clients/:clientId/patients/:patientId/bloods/other")
@UseGuards(AuthGuard('jwt'))
export class OtherController {
    constructor(private readonly otherService: OtherService) {
    }


    @Get("")
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number): Promise<Other> {
        return await this.otherService.find(clientId, patientId);
    }

    @Put()
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number,  @Body() model: CreateOrUpdateOtherModel, @Request() request): Promise<SuccessResult> {
        let success = await this.otherService.setOtherInfo(clientId, patientId, model.magnesium, model.amylase, model.crp, model.haematinicsFerritin, model.troponinI, model.hba1c, model.lactate);
        return new SuccessResult(success);
    }
}
