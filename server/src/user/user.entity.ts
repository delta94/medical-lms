export interface User {
    id?: number;
    clientId: number;
    name: string;
    email: string;
    role: Role;
    disabled: boolean;
    mfaEnabled: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export enum Role {
    Standard = 1,
    SuperUser = 10,
    Admin = 9001
}

export interface SamlData {
    userId: number;
    identifier: string;
    session_index: string;
}