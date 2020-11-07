import {deleteRequest, getRequest, postRequest, putRequest} from "../HttpMethods";
import {SuccessResult} from "../SuccessResult";
import {IPaginatedList, IQueryRequest} from "../QueryRequest";

export let ClientApi = {
    create(newClient: Client): Promise<Client> {
        return postRequest(getBaseUrl(), newClient);
    },
    find(query: IQueryRequest): Promise<IPaginatedList<Client>> {
        return getRequest(getBaseUrl(), query);
    },
    findById(id: number): Promise<Client> {
        return getRequest(`${getBaseUrl()}/${id}`);
    },
    update(id: number, updatedClient: Client): Promise<Client> {
        return putRequest(`${getBaseUrl()}/${id}`, updatedClient);
    },
    delete(id: number): Promise<SuccessResult> {
        return deleteRequest(`${getBaseUrl()}/${id}`);
    }
};

function getBaseUrl(): string {
    return "/api/v1/clients";
}

export interface Client {
    id: number;
    name: string;
    disabled: boolean;
    subdomain: string;
    logo: string;
    createdAt: string;
    updatedAt: string;
}

export function emptyClient(): Client {
    return {
        id: 0,
        name: "",
        disabled: false,
        subdomain: "",
        logo: "",
        createdAt: "",
        updatedAt: ""
    }
}