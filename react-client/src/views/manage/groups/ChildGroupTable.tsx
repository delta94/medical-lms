import React, {useState} from "react";
import {User} from "api/v1/UserApi";
import {DataTable} from "components/DataTable";
import If from "components/If";
import Icon from "components/Icon";
import {Group, GroupApi} from "../../../api/v1/GroupApi";
import {emptyPaginatedList, IPaginatedList, IQueryRequest, QueryRequest} from "../../../api/QueryRequest";
import {useTranslation} from "react-i18next";
import AddChildGroup from "./AddChildGroup";

export default function ChildGroupTable(props: IChildGroupTableProps) {
    const [data, setData] = useState<IPaginatedList<Group>>(emptyPaginatedList());
    const [showModal, setShowModal] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [query, setQuery] = useState<IQueryRequest>(new QueryRequest());
    const [queryUpdated, setQueryUpdated] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        GroupApi.findChildGroups(props.clientId, props.groupId, query)
            .then(data => {
                setData(data);
                setLoaded(true);
            });
    }

    function removeChildGroup(id: number) {
        GroupApi.removeChildGroup(props.clientId, props.groupId, id)
            .then(_ => {
                refresh();
            });
    }

    if (!loaded && props.clientId !== 0 && props.groupId !== 0) {
        refresh();
    }

    if (queryUpdated) {
        refresh();
        setQueryUpdated(false);
    }

    function queryChange(query: IQueryRequest) {
        setQuery(query);
        setQueryUpdated(true);
    }

    return (
        <div className={props.className ?? ""}>
            <If conditional={showModal}>
                <AddChildGroup clientId={props.clientId} groupId={props.groupId}
                           hide={() => setShowModal(false)}
                           confirm={() => {
                               setShowModal(false);
                               refresh();
                           }}/>
            </If>
            <DataTable onQueryChange={queryChange} title={t("child-groups")} data={data} columns={[
                {label: t("name"), key: "name"},
                {
                    key: "rowActions", render: (user: User) => {
                        return (
                            <div className="float-right">
                                <Icon title={t("remove")} href="#" onClick={() => {
                                    removeChildGroup(user.id);
                                }}>close</Icon>
                            </div>
                        )
                    }
                }
            ]} plusTitle={t("add")} onPlusClick={() => setShowModal(true)}/>
        </div>
    );
}

export interface IChildGroupTableProps {
    clientId: number;
    groupId: number;
    className?: any;
}