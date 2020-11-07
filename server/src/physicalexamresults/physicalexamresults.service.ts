import {Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Role} from "@/user/user.entity";
import {PhysicalExamResultsRepository} from "@/physicalexamresults/physicalexamresults.repository";
import {PhysicalExamResults} from "@/physicalexamresults/physicalexamresults.entity";
import {PaginatedList} from "@/PaginatedList";
import {QueryRequest} from "@/FilteredQueryRequest";


@Injectable({scope: Scope.REQUEST})
export class PhysicalExamResultsService {
    constructor(
        private readonly examResultsRepo: PhysicalExamResultsRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async create(clientId: number, patientId: number, regionId: number, result: string, appropriate: boolean): Promise<PhysicalExamResults> {
        this.authorise(clientId, Role.SuperUser);
        let examResults: PhysicalExamResults = {
            clientId: clientId,
            patientId: patientId,
            regionId: regionId,
            result: result,
            appropriate: appropriate
        };
        return await this.examResultsRepo.create(examResults);
    }

    async find(clientId: number, patientId: number, queryRequest: QueryRequest): Promise<PaginatedList<PhysicalExamResults | null>> {
        this.authorise(clientId, Role.Standard);
        return await this.examResultsRepo.find(clientId, patientId, queryRequest);
    }

    async update(clientId: number, patientId: number, id: number, regionId: number, result: string, appropriate: boolean): Promise<PhysicalExamResults> {
        this.authorise(clientId, Role.SuperUser);
        let examResults = await this.examResultsRepo.findById(clientId, patientId, id);
        examResults.regionId = regionId;
        examResults.result = result;
        examResults.appropriate = appropriate;
        return await this.examResultsRepo.update(examResults);
    }

    async findById(clientId: number, patientId: number, id: number): Promise<PhysicalExamResults | null> {
        this.authorise(clientId, Role.Standard);
        return await this.examResultsRepo.findById(clientId, patientId, id);
    }

    authorise(clientId: number, minRole: Role): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < minRole)
            throw new UnauthorizedException();
    }
}
