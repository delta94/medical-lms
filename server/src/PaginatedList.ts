export class PaginatedList<T> {
    list: T[];
    totalCount: number;
    pageSize: number;
    page: number;
    noOfPages: number;

    constructor(list: T[], totalCount: number, pageSize: number, page: number) {
        this.list = list;
        this.totalCount = totalCount;
        this.pageSize = pageSize;
        this.page = page;
        this.noOfPages = Math.ceil(totalCount / pageSize);
    }
}