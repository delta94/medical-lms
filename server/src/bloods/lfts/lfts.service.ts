import {Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Role} from "@/user/user.entity";
import {LftsRepository} from "@/bloods/lfts/lfts.repository";
import {LFTS} from "@/bloods/lfts/lfts.entity";


@Injectable({scope: Scope.REQUEST})
export class LftsService {
    constructor(
        private readonly lftsRepository: LftsRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async setLFTSInfo(clientId: number, patientId: number, alp: number, alt: number, bilirubin: number, albumin: number): Promise<boolean> {
        this.authorise(clientId, Role.SuperUser);
        return await this.lftsRepository.setLFTSInfo(clientId, patientId, alp, alt, bilirubin, albumin);
    }

    async find(clientId: number, patientId: number): Promise<LFTS | null> {
        this.authorise(clientId, Role.Standard);
        return await this.lftsRepository.find(clientId, patientId);
    }

    authorise(clientId: number, minRole: Role): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < minRole)
            throw new UnauthorizedException();
    }
}
