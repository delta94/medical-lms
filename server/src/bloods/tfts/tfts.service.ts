import {Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Role} from "@/user/user.entity";
import {TftsRepository} from "@/bloods/tfts/tfts.repository";
import {TFTS} from "@/bloods/tfts/tfts.entity";


@Injectable({scope: Scope.REQUEST})
export class TftsService {
    constructor(
        private readonly tftsRepo: TftsRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async setTFTSInfo(clientId: number, patientId: number, tsh: number, freeT4: number, freeT3: number ): Promise<boolean> {
        this.authorise(clientId, Role.SuperUser);
        return await this.tftsRepo.setTFTSInfo(clientId, patientId, tsh, freeT4, freeT3 );
    }

    async find(clientId: number, patientId: number): Promise<TFTS | null> {
        this.authorise(clientId, Role.Standard);
        return await this.tftsRepo.find(clientId, patientId);
    }

    authorise(clientId: number, minRole: Role): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < minRole)
            throw new UnauthorizedException();
    }
}
