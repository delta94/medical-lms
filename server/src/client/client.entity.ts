export interface Client {
    id?: number;
    name: string;
    disabled: boolean;
    subdomain: string;
    logo: string;
    createdAt?: string;
    updatedAt?: string;
}