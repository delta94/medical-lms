import {IsNotEmpty} from "class-validator";
import {Body, Controller, Get, Param, ParseIntPipe, Put, Request, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {SuccessResult} from "@/SuccessResult";
import {UesService} from "@/bloods/ues/ues.service";
import {UES} from "@/bloods/ues/ues.entity";

export class CreateOrUpdateUESModel {
    @IsNotEmpty()
    readonly sodium: number;
    @IsNotEmpty()
    readonly potassium: number;
    @IsNotEmpty()
    readonly urea:number;
    @IsNotEmpty()
    readonly creatinine: number;
    @IsNotEmpty()
    readonly eGFR: number;


}

@Controller("/api/v1/clients/:clientId/patients/:patientId/bloods/ues")
@UseGuards(AuthGuard('jwt'))
export class UesController {
    constructor(private readonly uesService: UesService) {
    }


    @Get("")
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number): Promise<UES> {
        return await this.uesService.find(clientId, patientId);
    }

    @Put()
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number,  @Body() model: CreateOrUpdateUESModel, @Request() request): Promise<SuccessResult> {
        let success = await this.uesService.setUESInfo(clientId, patientId, model.sodium, model.potassium, model.urea, model.creatinine, model.eGFR );
        return new SuccessResult(success);
    }
}
