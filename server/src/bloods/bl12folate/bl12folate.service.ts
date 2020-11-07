import {Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Role} from "@/user/user.entity";
import {BL12Folate} from "@/bloods/bl12folate/bl12folate.entity";
import {Bl12folateRepository} from "@/bloods/bl12folate/bl12folate.repository";


@Injectable({scope: Scope.REQUEST})
export class Bl12folateService {
    constructor(
        private readonly bl12folateRepository: Bl12folateRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async setBl12FolateInfo(clientId: number, patientId: number, vitaminB12: number, folate: number): Promise<boolean> {
        this.authorise(clientId, Role.SuperUser);
        return await this.bl12folateRepository.setBl12FolateInfo(clientId, patientId, vitaminB12, folate);
    }

    async find(clientId: number, patientId: number): Promise<BL12Folate | null> {
        this.authorise(clientId, Role.Standard);
        return await this.bl12folateRepository.find(clientId, patientId);
    }

    authorise(clientId: number, minRole: Role): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < minRole)
            throw new UnauthorizedException();
    }
}
