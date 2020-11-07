export interface Scenario {
    id?: number;
    clientId: number;
    name: string;
    description: string;
    coverImage: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
}
