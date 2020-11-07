import {IsNotEmpty} from "class-validator";
import {Body, Controller, Get, Param, ParseIntPipe, Put, Request, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {SuccessResult} from "@/SuccessResult";
import {BoneProfileService} from "@/bloods/boneprofile/boneprofile.service";
import {BoneProfile} from "@/bloods/boneprofile/boneprofile.entity";

export class CreateOrUpdateBoneProfileModel {
    @IsNotEmpty()
    readonly correctedCalcium: number;
    @IsNotEmpty()
    readonly alp: number;
    @IsNotEmpty()
    readonly phosphate:number;

}

@Controller("/api/v1/clients/:clientId/patients/:patientId/bloods/boneprofile")
@UseGuards(AuthGuard('jwt'))
export class BoneProfileController {
    constructor(private readonly boneProfileService: BoneProfileService) {
    }


    @Get("")
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number): Promise<BoneProfile> {
        return await this.boneProfileService.find(clientId, patientId);
    }

    @Put()
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number,  @Body() model: CreateOrUpdateBoneProfileModel, @Request() request): Promise<SuccessResult> {
        let success = await this.boneProfileService.setBoneProfileInfo(clientId, patientId, model.correctedCalcium, model.alp, model.phosphate);
        return new SuccessResult(success);
    }
}
