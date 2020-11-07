import {IsNotEmpty} from "class-validator";
import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Request,
    UseGuards
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {PaginatedList} from "@/PaginatedList";
import {getQueryRequest} from "@/FilteredQueryRequest";
import {ClerkingInfo} from "@/clerkinginfo/clerkinginfo.entity";
import {ClerkingInfoService} from "@/clerkinginfo/clerkinginfo.service";
import {SuccessResult} from "@/SuccessResult";
import {CreateOrUpdateSSOModel} from "@/sso/sso.controller";

export class CreateOrUpdateClerkingInfoModel {
    @IsNotEmpty()
    readonly currentComplaintHistory: string;
    @IsNotEmpty()
    readonly medicalHistory: string;
    @IsNotEmpty()
    readonly smokingStatus: boolean;
    @IsNotEmpty()
    readonly alcoholConsumption: number;
    @IsNotEmpty()
    readonly performanceStatus: string;
    @IsNotEmpty()
    readonly adl: string;
    @IsNotEmpty()
    readonly drugHistory: string;
    @IsNotEmpty()
    readonly allergies: string;
    @IsNotEmpty()
    readonly familyHistory: string;
    @IsNotEmpty()
    readonly systemicReview: string;
}

@Controller("/api/v1/clients/:clientId/patients/:patientId/clerking")
@UseGuards(AuthGuard('jwt'))
export class ClerkingInfoController {
    constructor(private readonly cInfoService: ClerkingInfoService) {
    }

    @Get()
    async find(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number): Promise<ClerkingInfo> {
        let result = await this.cInfoService.find(clientId, patientId);
        if (result) return result;
        else throw new NotFoundException();
    }

    @Put()
    async update(@Param("clientId", new ParseIntPipe()) clientId: number, @Param("patientId", new ParseIntPipe()) patientId: number,  @Body() model: CreateOrUpdateClerkingInfoModel): Promise<SuccessResult> {
        let success = await this.cInfoService.setClerkingInfo(clientId, patientId, model.currentComplaintHistory, model.medicalHistory, model.smokingStatus, model.alcoholConsumption, model.performanceStatus, model.adl, model.drugHistory, model.allergies, model.familyHistory, model.systemicReview);
        return new SuccessResult(success);
    }
}
