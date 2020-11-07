import {deleteRequest, getRequest, postRequest, putRequest} from "../HttpMethods";
import {SuccessResult} from "../SuccessResult";
import {User} from "./UserApi";
import {IPaginatedList, IQueryRequest} from "../QueryRequest";

export let GroupApi = {
    create(clientId: number, newGroup: Group): Promise<Group> {
        return postRequest(getBaseUrl(clientId), newGroup);
    },
    find(clientId: number, queryRequest: IQueryRequest): Promise<IPaginatedList<Group>> {
        return getRequest(getBaseUrl(clientId), queryRequest);
    },
    findById(clientId: number, id: number): Promise<Group> {
        return getRequest(`${getBaseUrl(clientId)}/${id}`);
    },
    update(clientId: number, id: number, updatedGroup: Group): Promise<Group> {
        return putRequest(`${getBaseUrl(clientId)}/${id}`, updatedGroup);
    },
    delete(clientId: number, id: number): Promise<SuccessResult> {
        return deleteRequest(`${getBaseUrl(clientId)}/${id}`);
    },
    findMembers(clientId: number, id: number, queryRequest: IQueryRequest): Promise<IPaginatedList<User>> {
        return getRequest(`${getBaseUrl(clientId)}/${id}/members`, queryRequest);
    },
    addMember(clientId: number, groupId: number, userId: number): Promise<SuccessResult> {
        return postRequest(`${getBaseUrl(clientId)}/${groupId}/members`, {userId});
    },
    removeMember(clientId: number, groupId: number, userId: number): Promise<SuccessResult> {
        return deleteRequest(`${getBaseUrl(clientId)}/${groupId}/members/${userId}`);
    },
    findChildGroups(clientId: number, id: number, queryRequest: IQueryRequest): Promise<IPaginatedList<Group>> {
        return getRequest(`${getBaseUrl(clientId)}/${id}/children`, queryRequest);
    },
    addChildGroup(clientId: number, id: number, childGroupId: number): Promise<SuccessResult> {
        return postRequest(`${getBaseUrl(clientId)}/${id}/children`, {childGroupId});
    },
    removeChildGroup(clientId: number, id: number, childGroupId: number): Promise<SuccessResult> {
        return deleteRequest(`${getBaseUrl(clientId)}/${id}/children/${childGroupId}`);
    }
};

function getBaseUrl(clientId: number): string {
    return `/api/v1/clients/${clientId}/groups`;
}

export interface Group {
    clientId: number;
    id: number;
    name: string;
    isEveryone: boolean;
    createdAt: string;
    updatedAt: string;
}

export function emptyGroup(): Group {
    return {
        clientId: 0,
        id: 0,
        name: "",
        isEveryone: false,
        createdAt: "",
        updatedAt: ""
    }
}