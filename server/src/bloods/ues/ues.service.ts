import {Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Role} from "@/user/user.entity";
import {UesRepository} from "@/bloods/ues/ues.repository";
import {UES} from "@/bloods/ues/ues.entity";


@Injectable({scope: Scope.REQUEST})
export class UesService {
    constructor(
        private readonly uesRepository: UesRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async setUESInfo(clientId: number, patientId: number, sodium: number, potassium: number, urea: number, creatinine: number, eGFR: number): Promise<boolean> {
        this.authorise(clientId, Role.SuperUser);
        return await this.uesRepository.setUESInfo(clientId, patientId, sodium,
            potassium,
            urea,
            creatinine,
            eGFR);
    }

    async find(clientId: number, patientId: number): Promise<UES | null> {
        this.authorise(clientId, Role.Standard);
        return await this.uesRepository.find(clientId, patientId);
    }

    authorise(clientId: number, minRole: Role): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < minRole)
            throw new UnauthorizedException();
    }
}
