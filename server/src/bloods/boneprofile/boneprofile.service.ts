import {Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Role} from "@/user/user.entity";
import {BoneProfileRepository} from "@/bloods/boneprofile/boneprofile.repository";
import {BoneProfile} from "@/bloods/boneprofile/boneprofile.entity";


@Injectable({scope: Scope.REQUEST})
export class BoneProfileService {
    constructor(
        private readonly boneProfileRepository: BoneProfileRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async setBoneProfileInfo(clientId: number, patientId: number, correctedCalcium: number, alp: number, phosphate: number ): Promise<boolean> {
        this.authorise(clientId, Role.SuperUser);
        return await this.boneProfileRepository.setBoneProfileInfo(clientId, patientId, correctedCalcium, alp, phosphate);
    }

    async find(clientId: number, patientId: number): Promise<BoneProfile | null> {
        this.authorise(clientId, Role.Standard);
        return await this.boneProfileRepository.find(clientId, patientId);
    }

    authorise(clientId: number, minRole: Role): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < minRole)
            throw new UnauthorizedException();
    }
}
