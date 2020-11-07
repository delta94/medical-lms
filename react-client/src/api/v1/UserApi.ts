import {deleteRequest, getRequest, postRequest, putRequest} from "../HttpMethods";
import {SuccessResult} from "../SuccessResult";
import {IPaginatedList, IQueryRequest} from "../QueryRequest";

export let UserApi = {
    create(clientId: number, newUser: User): Promise<User> {
        return postRequest(getBaseUrl(clientId), newUser);
    },
    find(clientId: number, queryRequest: IQueryRequest): Promise<IPaginatedList<User>> {
        return getRequest(getBaseUrl(clientId), queryRequest);
    },
    findById(clientId: number, id: number): Promise<User> {
        return getRequest(`${getBaseUrl(clientId)}/${id}`);
    },
    update(clientId: number, id: number, updatedUser: User): Promise<User> {
        return putRequest(`${getBaseUrl(clientId)}/${id}`, updatedUser);
    },
    delete(clientId: number, id: number): Promise<SuccessResult> {
        return deleteRequest(`${getBaseUrl(clientId)}/${id}`);
    }
};

function getBaseUrl(clientId: number): string {
    return `/api/v1/clients/${clientId}/users`;
}

export interface User {
    clientId: number;
    id: number;
    name: string;
    email: string;
    role: Role,
    disabled: boolean,
    updatedAt: string;
    createdAt: string;
}

export enum Role {
    Standard = 1,
    SuperUser = 10,
    Admin = 9001
}

export function emptyUser(): User {
    return {
        clientId: 0,
        id: 0,
        name: "",
        email: "",
        role: Role.Standard,
        disabled: false,
        updatedAt: "",
        createdAt: ""
    }
}