//https://vitaly-t.github.io/pg-promise/Database.html#many
export interface PgPromiseDb {
    any(query: string | ((any) => any) | object, values?: any | null): Promise<any[]>;
    many(query: string | ((any) => any) | object, values?: any | null): Promise<any>;
    manyOrNone(query: string | ((any) => any) | object, values?: any | null): Promise<any[]>;
    multi(query: string | ((any) => any) | object, values?: any | null): Promise<(any[])[]>;
    multiResult(query: string | ((any) => any) | object, values?: any | null): Promise<(any[])[]>;
    none(query: string, params?: any | null): Promise<null>;
    one(query: string, params?: any | null): Promise<any>;
    oneOrNone(query: string, params?: any | null): Promise<any|null>;
    query(query: string, params?: any | null): Promise<any>;
    result(query: string, params?: any | null, filter?: (thing: PgPromiseResult) => any): Promise<any>;
}

export interface PgPromiseResult {
    command: string;
    rowCount: number;
    rowAsArray: boolean;
    duration: number;
}