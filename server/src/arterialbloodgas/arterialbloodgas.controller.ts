import {IsNotEmpty} from "class-validator";
import {Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Put, Request, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {SuccessResult} from "@/SuccessResult";
import {ArterialBloodGasService} from "@/arterialbloodgas/arterialbloodgas.service";
import {ArterialBloodGas} from "@/arterialbloodgas/arterialbloodgas.entity";

export class CreateOrUpdateArterialBloodGas {
    @IsNotEmpty()
    readonly ph: number;
    @IsNotEmpty()
    readonly pao2: number;
    @IsNotEmpty()
    readonly paco2:number;
    @IsNotEmpty()
    readonly hco3: number;
    @IsNotEmpty()
    readonly baseExcess: number;
    @IsNotEmpty()
    readonly lactate: number;
}

@Controller("/api/v1/clients/:clientId/patients/:patientId/abg")
@UseGuards(AuthGuard('jwt'))
export class ArterialBloodGasController {
    constructor(private readonly arterialBloodGasService: ArterialBloodGasService) {
    }

    @Get()
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number): Promise<ArterialBloodGas> {
        let result = await this.arterialBloodGasService.find(clientId, patientId);
        if (result)
            return result;
        else
            throw new NotFoundException();
    }

    @Put()
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number,  @Body() model: CreateOrUpdateArterialBloodGas, @Request() request): Promise<SuccessResult> {
        let success = await this.arterialBloodGasService.setArterialBloodGas(clientId, patientId, model.ph, model.pao2, model.paco2, model.hco3, model.baseExcess, model.lactate);
        return new SuccessResult(success);
    }
}
