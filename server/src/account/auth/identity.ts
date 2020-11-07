import {Role} from "@/user/user.entity";

export interface IIdentity {
    readonly id: number;
    readonly clientId: number;
    readonly email: string;
    readonly role: Role;
}

export class Identity implements IIdentity {
    readonly id: number;
    readonly clientId: number;
    readonly name: string;
    readonly email: string;
    readonly role: Role;
    readonly isAuthenticated: boolean;
    static noUser: Identity = new Identity();

    /**
     * Empty constructor only to be used within the class;
     */
    constructor();
    constructor(id?: number, clientId?: number, name?: string, email?: string, role?: Role, isAuthenticated?: boolean) {
        if (!id) {
            this.isAuthenticated = false;
        } else {
            this.id = id;
            this.clientId = clientId;
            this.name = name;
            this.email = email;
            this.role = role;
            this.isAuthenticated = isAuthenticated;
        }
    }
}