import {IsNotEmpty} from "class-validator";
import {Body, Controller, Get, Param, ParseIntPipe, Put, Request, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {SuccessResult} from "@/SuccessResult";
import {Bl12folateService} from "@/bloods/bl12folate/bl12folate.service";
import {BL12Folate} from "@/bloods/bl12folate/bl12folate.entity";

export class CreateOrUpdateFBCModel {
    @IsNotEmpty()
    readonly vitaminB12: number;
    @IsNotEmpty()
    readonly folate: number;

}

@Controller("/api/v1/clients/:clientId/patients/:patientId/bloods/bl12folate")
@UseGuards(AuthGuard('jwt'))
export class Bl12folateController {
    constructor(private readonly bl12folateService: Bl12folateService) {
    }


    @Get("")
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number): Promise<BL12Folate> {
        return await this.bl12folateService.find(clientId, patientId);
    }

    @Put()
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number,  @Body() model: CreateOrUpdateFBCModel, @Request() request): Promise<SuccessResult> {
        let success = await this.bl12folateService.setBl12FolateInfo(clientId, patientId, model.vitaminB12, model.folate);
        return new SuccessResult(success);
    }
}
