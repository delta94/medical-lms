import {Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Role} from "@/user/user.entity";
import {OtherRepository} from "@/bloods/other/other.repository";
import {Other} from "@/bloods/other/other.entity";


@Injectable({scope: Scope.REQUEST})
export class OtherService {
    constructor(
        private readonly otherRepo: OtherRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async setOtherInfo(clientId: number, patientId: number, magnesium: number, amylase: number, crp: number, haematinicsFerritin: number, troponinI: number, hba1c: number, lactate: number): Promise<boolean> {
        this.authorise(clientId, Role.SuperUser);
        return await this.otherRepo.setOtherInfo(clientId, patientId, magnesium, amylase, crp, haematinicsFerritin, troponinI, hba1c, lactate);
    }

    async find(clientId: number, patientId: number): Promise<Other | null> {
        this.authorise(clientId, Role.Standard);
        return await this.otherRepo.find(clientId, patientId);
    }

    authorise(clientId: number, minRole: Role): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < minRole)
            throw new UnauthorizedException();
    }
}
