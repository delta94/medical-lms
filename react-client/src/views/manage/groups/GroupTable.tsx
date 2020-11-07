import {useGlobalState} from "state/GlobalState";
import React, {useState} from "react";
import {DataTable} from "components/DataTable";
import If from "components/If";
import {Breadcrumb} from "react-bootstrap";
import {Group, GroupApi} from "api/v1/GroupApi";
import {CreateOrUpdateGroup} from "./CreateOrUpdateGroup";
import {Link} from "react-router-dom";
import {emptyPaginatedList, IPaginatedList, IQueryRequest, QueryRequest} from "api/QueryRequest";
import {useTranslation} from "react-i18next";
import {DeleteIcon, UpdateIcon} from "../../../components/CrudIcons";
import {IndexLinkContainer} from "react-router-bootstrap";

export default function GroupTable(props: IGroupsTableProps) {
    const [globalState] = useGlobalState();
    const [data, setData] = useState<IPaginatedList<Group>>(emptyPaginatedList());
    const [showModal, setShowModal] = useState(false);
    const [updateGroupId, setUpdateGroupId] = useState<number | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [query, setQuery] = useState<IQueryRequest>(new QueryRequest());
    const [queryUpdated, setQueryUpdated] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        GroupApi.find(props.clientId, query)
            .then(data => {
                setData(data);
                setLoaded(true);
            });
    }

    function deleteGroup(id: number) {
        GroupApi.delete(props.clientId, id)
            .then(_ => {
                refresh();
            });
    }

    if (!loaded && props.clientId !== 0) {
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
        <div>
            <If conditional={globalState.user.clientId !== props.clientId}>
                <Breadcrumb>
                    <IndexLinkContainer to="/admin/clients">
                        <Breadcrumb.Item>{t("clients")}</Breadcrumb.Item>
                    </IndexLinkContainer>
                    <IndexLinkContainer to={`/admin/clients/${props.clientId}`}>
                        <Breadcrumb.Item>{t("manage")}</Breadcrumb.Item>
                    </IndexLinkContainer>
                    <Breadcrumb.Item active>{t("groups")}</Breadcrumb.Item>
                </Breadcrumb>
            </If>
            <If conditional={showModal}>
                <CreateOrUpdateGroup clientId={props.clientId} groupId={updateGroupId}
                                     hide={() => setShowModal(false)} success={() => {
                    setShowModal(false);
                    refresh();
                }}/>
            </If>
            <DataTable onQueryChange={queryChange} title={t("groups")} data={data} columns={[
                {
                    label: t("name"), key: "name", sortable: true, render: (group: Group) => {
                        if (globalState.user.clientId === props.clientId)
                            return <Link to={`/manage/groups/${group.id}`}>{group.name}</Link>;
                        else return <Link to={`/admin/clients/${props.clientId}/manage/groups/${group.id}`}>{group.name}</Link>;
                    }
                },
                {
                    key: "rowActions", render: (group: Group) => {
                        return (
                            <div className="float-right">
                                <UpdateIcon disabled={group.isEveryone} onClick={() => {
                                    setUpdateGroupId(group.id);
                                    setShowModal(true);
                                }}/>
                                <DeleteIcon disabled={group.isEveryone} onClick={() => {
                                    deleteGroup(group.id);
                                }}/>
                            </div>
                        )
                    }
                }
            ]} onPlusClick={() => {
                setUpdateGroupId(null);
                setShowModal(true);
            }} />
        </div>
    );
}

export interface IGroupsTableProps {
    clientId: number;
}