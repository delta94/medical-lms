import {Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Role} from "@/user/user.entity";
import {FbcRepository} from "@/bloods/fbc/fbc.repository";
import {FBC} from "@/bloods/fbc/fbc.entity";


@Injectable({scope: Scope.REQUEST})
export class FbcService {
    constructor(
        private readonly fbcRepository: FbcRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async setFBCInfo(clientId: number, patientId: number, hb: number, mcv: number, mch:number, totalWcc: number, neutrophils: number, lymphocytes: number, monocytes: number, eosinophils: number, platelets: number ): Promise<boolean> {
        this.authorise(clientId, Role.SuperUser);
        return await this.fbcRepository.setFBCInfo(clientId, patientId, hb, mcv, mch, totalWcc, neutrophils, lymphocytes, monocytes, eosinophils, platelets);
    }

    async find(clientId: number, patientId: number): Promise<FBC | null> {
        this.authorise(clientId, Role.Standard);
        return await this.fbcRepository.find(clientId, patientId);
    }

    authorise(clientId: number, minRole: Role): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < minRole)
            throw new UnauthorizedException();
    }
}
