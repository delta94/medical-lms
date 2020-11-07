import React, {useState} from "react";
import If, {Else, Then} from "./If";
import TablePagination from "./TablePagination";
import {Button, FormControl, Table} from "react-bootstrap";
import {IPaginatedList, IQueryRequest, QueryRequest} from "../api/QueryRequest";
import {useTranslation} from "react-i18next";
import Icon from "./Icon";

export function DataTable(props: IDataTableProps) {
    const [query, setQuery] = useState<IQueryRequest>(new QueryRequest());
    const [queryUpdated, setQueryUpdated] = useState(false);
    const {t} = useTranslation();

    if (queryUpdated) {
        props.onQueryChange?.(query);
        setQueryUpdated(false);
    }

    function changeOrderBy(column: ITableColumn) {
        if (column.sortable) {
            if (column.key === query.orderBy) {
                setQuery(new QueryRequest(query.page, query.pageSize, query.orderBy, !query.orderByAsc, query.searchTerm));
                setQueryUpdated(true);
            } else {
                setQuery(new QueryRequest(query.page, query.pageSize, column.key, query.orderByAsc, query.searchTerm));
                setQueryUpdated(true);
            }
        }
    }

    let headers: JSX.Element[] = [];
    for (const [index, value] of props.columns.entries()) {
        headers.push(
            <th key={index} className={value.sortable ? "clickable unselectable" : "unselectable"} onClick={() => changeOrderBy(value)}>
                {value.label}
                <If conditional={query.orderBy === value.key}>
                    <If conditional={query.orderByAsc} hasElse={true}>
                        <Then>
                            <Icon className="d-inline align-bottom">arrow_upward</Icon>
                        </Then>
                        <Else>
                            <Icon className="d-inline align-bottom">arrow_downward</Icon>
                        </Else>
                    </If>
                </If>
            </th>
        );
    }

    const items: JSX.Element[] = [];
    for (const [index, value] of props.data.list.entries()) {
        let dataRows: JSX.Element[] = [];
        for (const [i, v] of props.columns.entries()) {
            if (v.render) dataRows.push(<td key={i}>{v.render(value)}</td>);
            else {
                let val = value[v.key];
                if (val)
                    dataRows.push(<td key={i}>{value[v.key]}</td>);
                else dataRows.push(<td key={i}>null</td>);
            }
        }

        let item = (
            <tr key={index}>
                {dataRows}
            </tr>
        );
        items.push(item);
    }

    return (
        <div>
            <Table className="border" striped hover>
                <thead>
                <tr>
                    <th colSpan={headers.length}>
                        {props.title}
                        <span className="float-right">
                            <If conditional={props.actionsRender !== null}>
                                <Then>
                                    {props.actionsRender?.()}
                                </Then>
                            </If>
                            <If conditional={props.onPlusClick !== undefined}>
                                <Button className="rounded-pill" variant="primary"
                                        title={props.plusTitle ?? t("create")} onClick={props.onPlusClick}>
                                    <Icon className="text-white align-bottom">add</Icon>
                                </Button>
                            </If>

						</span>
                    </th>
                </tr>
                <tr>
                    <th colSpan={headers.length}>
                        <div className="w-35">
                            <FormControl value={query.searchTerm} onChange={(e) => {
                                setQuery(new QueryRequest(query.page, query.pageSize, query.orderBy, query.orderByAsc, (e.target as any).value));
                                setQueryUpdated(true);
                            }}/>
                        </div>
                    </th>
                </tr>
                <tr>
                    {headers}
                </tr>
                </thead>
                <tbody>
                {items}
                <If conditional={items.length === 0}>
                    <tr>
                        <td colSpan={headers.length}>{t("no-results")}</td>
                    </tr>
                </If>
                </tbody>
            </Table>
            <span>
                <TablePagination className="d-inline mr-5" noOfPages={Math.ceil(props.data.totalCount / query.pageSize)}
                                 page={query.page}
                                 setPage={(page) => {
                                     setQuery(new QueryRequest(page, query.pageSize, query.orderBy, query.orderByAsc, query.searchTerm));
                                     setQueryUpdated(true);
                                 }}/>
                <FormControl className="d-inline w-15" value={query.pageSize.toString()} onChange={(e) => {
                    setQuery(new QueryRequest(query.page, +(e.target as any).value, query.orderBy, query.orderByAsc, query.searchTerm));
                    setQueryUpdated(true);
                }} as="select">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </FormControl>
            </span>
        </div>
    );
}

export interface IDataTableProps {
    title: string;
    data: IPaginatedList<any>;
    columns: ITableColumn[];

    onPlusClick?(): void;

    plusTitle?: string;

    actionsRender?(): JSX.Element;

    onQueryChange?(query: IQueryRequest): void;
}

export interface ITableColumn {
    label?: string;
    key: string;
    sortable?: boolean;

    render?(data: any): JSX.Element;
}
