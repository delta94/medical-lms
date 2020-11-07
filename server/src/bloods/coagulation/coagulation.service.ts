import {Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Role} from "@/user/user.entity";
import {CoagulationRepository} from "@/bloods/coagulation/coagulation.repository";
import {Coagulation} from "@/bloods/coagulation/coagulation.entity";


@Injectable({scope: Scope.REQUEST})
export class CoagulationService {
    constructor(
        private readonly coagulationRepository: CoagulationRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async setCoagulationInfo(clientId: number, patientId: number, pt: number, aptt: number, fibrinogen: number ): Promise<boolean> {
        this.authorise(clientId, Role.SuperUser);
        return await this.coagulationRepository.setCoagulationInfo(clientId, patientId, pt, aptt, fibrinogen);
    }

    async find(clientId: number, patientId: number): Promise<Coagulation | null> {
        this.authorise(clientId, Role.Standard);
        return await this.coagulationRepository.find(clientId, patientId);
    }

    authorise(clientId: number, minRole: Role): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < minRole)
            throw new UnauthorizedException();
    }
}
