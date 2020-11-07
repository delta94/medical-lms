import React, {useState} from "react";
import {User} from "api/v1/UserApi";
import {DataTable} from "components/DataTable";
import If from "components/If";
import Icon from "components/Icon";
import {UserRole} from 'components/UserRole';
import {GroupApi} from "../../../api/v1/GroupApi";
import AddMember from "./AddMember";
import {emptyPaginatedList, IPaginatedList, IQueryRequest, QueryRequest} from "../../../api/QueryRequest";
import {useTranslation} from "react-i18next";

export default function GroupMemberTable(props: IGroupMemberTableProps) {
    const [data, setData] = useState<IPaginatedList<User>>(emptyPaginatedList());
    const [showModal, setShowModal] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [query, setQuery] = useState<IQueryRequest>(new QueryRequest());
    const [queryUpdated, setQueryUpdated] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        GroupApi.findMembers(props.clientId, props.groupId, query)
            .then(data => {
                setData(data);
                setLoaded(true);
            });
    }

    function removeMember(id: number) {
        GroupApi.removeMember(props.clientId, props.groupId, id)
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
                <AddMember clientId={props.clientId} groupId={props.groupId}
                           hide={() => setShowModal(false)}
                           confirm={() => {
                               setShowModal(false);
                               refresh();
                           }}/>
            </If>
            <DataTable onQueryChange={queryChange} title={t("members")} data={data} columns={[
                {label: t("name"), key: "name", sortable: true},
                {label: t("email"), key: "email", sortable: true},
                {
                    label: t("role"), key: "role", sortable: true, render(user: User): JSX.Element {
                        return <UserRole value={user.role}/>
                    }
                },
                {
                    key: "rowActions", render: (user: User) => {
                        return (
                            <div className="float-right">
                                <Icon title={t("remove")} href="#" onClick={() => {
                                    removeMember(user.id);
                                }}>close</Icon>
                            </div>
                        )
                    }
                }
            ]} plusTitle={t("add")} onPlusClick={() => {
                setShowModal(true)
            }}/>
        </div>
    );
}

export interface IGroupMemberTableProps {
    clientId: number;
    groupId: number;
    className?: any;
}