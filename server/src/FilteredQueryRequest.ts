export class QueryRequest
{
    readonly page: number;
    readonly pageSize: number;
    readonly orderBy: string;
    readonly orderByAsc: boolean;
    readonly searchTerm: string;

    get getSearchTerm(): string {
        return `${this.searchTerm}%`;
    }

    get offset(): number {
        return (this.page - 1) * this.pageSize;
    }

    sanitiseOrderBy(safeList: string[]): string {
        if (safeList.includes(this.orderBy)) {
            return `${this.orderBy} ${this.orderByAsc ? "ASC" : "DESC"}`;
        } else {
            return `id ${this.orderByAsc ? "ASC" : "DESC"}`;
        }
    }

    constructor(page: number, pageSize: number, orderBy: string, orderByAsc: boolean, searchTerm: string) {
        this.page = page;
        this.pageSize = pageSize;
        this.orderBy = orderBy;
        this.orderByAsc = orderByAsc;
        this.searchTerm = searchTerm;
    }
}

export function getQueryRequest(query: any): QueryRequest {
    let page = isNaN(query.page) ? 1 : +query.page;
    let pageSize = isNaN(query.pageSize) ? 10 : +query.pageSize;
    return new QueryRequest(page, pageSize, query.orderBy ?? "id", (query.orderByAsc ?? true) !== "false", query.searchTerm ?? "");
}