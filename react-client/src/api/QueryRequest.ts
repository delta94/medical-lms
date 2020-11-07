export interface IQueryRequest {
    page: number;
    pageSize: number;
    orderBy: string;
    orderByAsc: boolean;
    searchTerm: string;
    toQueryString(): string;
}

export class QueryRequest implements IQueryRequest {
    constructor(readonly page: number = 1, readonly pageSize: number = 10, readonly orderBy: string = "id", readonly orderByAsc: boolean = true, readonly searchTerm: string = "") {

    }

    public toQueryString(): string {
        let str = `page=${this.page}&pageSize=${this.pageSize}&orderBy=${this.orderBy}&orderByAsc=${this.orderByAsc}`;
        if (this.searchTerm !== "") str += `&searchTerm=${encodeURIComponent(this.searchTerm)}`;

        return str;
    }
}

export interface IPaginatedList<T> {
    list: T[];
    totalCount: number;
    pageSize: number;
    page: number;
    noOfPages: number;
}

export function emptyPaginatedList<T>(): IPaginatedList<T> {
    return {
        list: [],
        totalCount: 0,
        pageSize: 10,
        page: 1,
        noOfPages: 0
    }
}
