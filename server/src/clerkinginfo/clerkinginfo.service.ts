import {Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Role} from "@/user/user.entity";
import {PaginatedList} from "@/PaginatedList";
import {QueryRequest} from "@/FilteredQueryRequest";
import {ClerkingInfoRepository} from "@/clerkinginfo/clerkinginfo.repository";
import {ClerkingInfo} from "@/clerkinginfo/clerkinginfo.entity";


@Injectable({scope: Scope.REQUEST})
export class ClerkingInfoService {
    constructor(
        private readonly cInfoRepository: ClerkingInfoRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async find(clientId: number, patientId: number): Promise<ClerkingInfo | null> {
        this.authorise(clientId, Role.Standard);
        return await this.cInfoRepository.find(clientId, patientId);
    }

    async setClerkingInfo(clientId: number, patientId: number, currentComplaintHistory: string, medicalHistory: string, smokingStatus: boolean, alcoholConsumption: number, performanceStatus: string, adl: string, drugHistory: string, allergies: string, familyHistory: string, systemicReview: string): Promise<boolean> {
        this.authorise(clientId, Role.SuperUser);
        return await this.cInfoRepository.setClerkingInfo(clientId, patientId, currentComplaintHistory, medicalHistory, smokingStatus, alcoholConsumption, performanceStatus, adl, drugHistory, allergies, familyHistory, systemicReview);
    }

    authorise(clientId: number, minRole: Role): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < minRole)
            throw new UnauthorizedException();
    }
}
