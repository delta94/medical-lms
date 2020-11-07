import {Inject, Injectable, Scope} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {PhysicalExamRegionRepository} from "@/physicalexamregions/physicalexamregion.repository";
import {PhysicalExamRegion} from "@/physicalexamregions/physicalexamregion.entity";

@Injectable({scope: Scope.REQUEST})
export class PhysicalExamRegionService {
    constructor(
        private readonly physicalExamRegionRepository: PhysicalExamRegionRepository,
        @Inject(REQUEST) private readonly request: any) {
    }
    async find(): Promise<PhysicalExamRegion[]>{
        return await this.physicalExamRegionRepository.find();
    }
}
