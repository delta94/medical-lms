//This file is based off https://github.com/lukewarlow/ts-http-methods/blob/master/src/index.ts
import {IQueryRequest} from "./QueryRequest";

export function postRequest(url: string, data: any = {}): Promise<any> {
    return makeRequest("POST", url, data);
}

export function getRequest(url: string, queryRequest: IQueryRequest | null = null): Promise<any> {
    if (queryRequest !== null) {
        if (url.indexOf('?') === -1) url += "?";
        else url += "&";

        url += queryRequest.toQueryString();
    }

    return makeRequest("GET", url);
}

export function putRequest(url: string, data: any = {}): Promise<any> {
    return makeRequest("PUT", url, data);
}

export function deleteRequest(url: string, data: any = {}): Promise<any> {
    return makeRequest("DELETE", url, data);
}

function makeRequest(method: string, url: string, data: any = {}): Promise<string | any | Promise<any>> {
    let headers: any = { "Accept": "application/json" };

    if (method !== "GET")
        headers["Content-Type"] = "application/json";

    let token = window.localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let requestInit: RequestInit = {
        method: method,
        headers: headers
    };

    if (method !== "GET")
        requestInit.body = JSON.stringify(data);

    return fetch(url, requestInit).then(handleResponse);
}

function handleResponse(response: Response): Promise<string | any | Promise<any>> {
    let contentType = response.headers.get("content-type");
    if (contentType) {
        //Add other response types as necessary.
        if (contentType.includes("json"))
            return handleJSONResponse(response);
        else if (contentType.includes("text/"))
            return handleTextResponse(response);
        else
            throw new Error(`Content-Type ${contentType} not supported. Use the fetch API directly or create a handler.`);
    } else if (response.status === 200 || response.status === 201 || response.status === 204) {
        return Promise.resolve({
            success: true,
            status: response.status
        });
    } else {
        return Promise.reject({
            status: response.status,
            statusText: response.statusText,
            err: "No content-type for response"
        });
    }
}

function handleJSONResponse(response: Response): Promise<any | Promise<any>> {
    return response.json()
        .then((json: any) => {
            if (response.ok)
                return json;
            else
                return Promise.reject(json);
        });
}

function handleTextResponse(response: Response): Promise<string | Promise<any>> {
    return response.text()
        .then((text: string) => {
            if (response.ok) return text;
            else {
                return Promise.reject({
                    status: response.status,
                    statusText: response.statusText,
                    err: text
                });
            }
        });
}