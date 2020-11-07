import {Role} from "@/user/user.entity";
import {Identity, IIdentity} from "@/account/auth/identity";
import {REQUEST} from "@nestjs/core";
import {Inject, Injectable, OnModuleInit, Scope, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";

export interface IUserContext {
    readonly user: IIdentity;
    readonly clientId: number;
    readonly email: string;
    readonly role: Role;
}

@Injectable({scope: Scope.REQUEST})
@UseGuards(AuthGuard("jwt"))
export class UserContext implements IUserContext {
    constructor(@Inject(REQUEST) private readonly request: any) {
    }

    get user(): IIdentity {
        return this.request?.user ?? Identity.noUser;
    }

    get clientId(): number {
        return this.user.clientId;
    }

    get email(): string {
        return this.user.email;
    }

    get role(): Role {
        return this.user.role;
    }
}

export const isAuthorisedForClient = (userContext: UserContext, clientId: number): boolean => userContext.clientId === clientId || userContext.role === Role.Admin;

export const isAuthorisedAtLevel = (userContext: UserContext, role: Role): boolean => userContext.role >= role;