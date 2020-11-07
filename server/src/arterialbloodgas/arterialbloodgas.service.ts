import {Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Role} from "@/user/user.entity";
import {ArterialBloodGasRepository} from "@/arterialbloodgas/arterialbloodgas.repository";
import {ArterialBloodGas} from "@/arterialbloodgas/arterialbloodgas.entity";


@Injectable({scope: Scope.REQUEST})
export class ArterialBloodGasService {
    constructor(
        private readonly arterialBloodGasRepo: ArterialBloodGasRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async setArterialBloodGas(clientId: number, patientId: number, ph: number, pao2: number, paco2: number, hco3: number, baseExcess: number, lactate: number): Promise<boolean> {
        this.authorise(clientId, Role.SuperUser);
        return await this.arterialBloodGasRepo.setArterialBloodGas(clientId, patientId, ph, pao2, paco2, hco3, baseExcess, lactate);
    }

    async find(clientId: number, patientId: number): Promise<ArterialBloodGas | null> {
        this.authorise(clientId, Role.Standard);
        return await this.arterialBloodGasRepo.find(clientId, patientId);
    }

    authorise(clientId: number, minRole: Role): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < minRole)
            throw new UnauthorizedException();
    }
}
