export interface Patient {
    id?: number;
    clientId: number;
    name: string;
    age: number;
    isFemale: boolean;
    description: string;
    height: number;
    weight: number;
    ethnicity: string;
    createdAt?: string;
    updatedAt?: string;
}
