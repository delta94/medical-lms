import {deleteRequest, getRequest, postRequest, putRequest} from "../HttpMethods";
import {IPaginatedList, IQueryRequest} from "../QueryRequest";
import {SuccessResult} from "../SuccessResult";

export let ResourceApi = {
    create(clientId: number, newResource: Resource): Promise<Resource> {
        return postRequest(getBaseUrl(clientId), newResource);
    },
    find(clientId: number, queryRequest: IQueryRequest): Promise<IPaginatedList<Resource>> {
        return getRequest(getBaseUrl(clientId), queryRequest);
    },
    findById(clientId: number, id: number): Promise<Resource> {
        return getRequest(`${getBaseUrl(clientId)}/${id}`);
    },
    update(clientId: number, id: number, updatedResource: Resource): Promise<Resource> {
        return putRequest(`${getBaseUrl(clientId)}/${id}`, updatedResource);
    },
    delete(clientId: number, id: number): Promise<SuccessResult> {
        return deleteRequest(`${getBaseUrl(clientId)}/${id}`);
    }
};

export interface Resource {
    clientId: number;
    id: number;
    name: string;
    type: string;
    html: string;
    description: string;
}

export function emptyResource(): Resource {
    return {
        clientId: 0,
        id: 0,
        name: '',
        type: '',
        html: '',
        description: ''
    }
}

function getBaseUrl(clientId: number): string {
    return `/api/v1/clients/${clientId}/resources`;
}
