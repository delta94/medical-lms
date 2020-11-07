import {Controller, Get, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {PhysicalExamRegionService} from "@/physicalexamregions/physicalexamregion.service";
import {PhysicalExamRegion} from "@/physicalexamregions/physicalexamregion.entity";

@Controller("/api/v1/physicalexam/regions")
@UseGuards(AuthGuard('jwt'))
export class PhysicalExamRegionController {
    constructor(private readonly regionService: PhysicalExamRegionService) {
    }
    @Get()
    async find(): Promise<PhysicalExamRegion[]> {
        return await this.regionService.find();
    }
}
