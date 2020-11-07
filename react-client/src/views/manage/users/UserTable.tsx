import {useGlobalState} from "state/GlobalState";
import React, {useState} from "react";
import {DataTable} from "components/DataTable";
import {CreateOrUpdateUser} from "views/manage/users/CreateOrUpdateUser";
import If from "components/If";
import {Breadcrumb} from "react-bootstrap";
import {UserRole} from 'components/UserRole';
import {Link} from "react-router-dom";
import {emptyPaginatedList, IPaginatedList, IQueryRequest, QueryRequest} from "../../../api/QueryRequest";
import {DeleteIcon, UpdateIcon} from "../../../components/CrudIcons";
import {useTranslation} from "react-i18next";
import {IndexLinkContainer} from "react-router-bootstrap";
import {Check} from "../../../components/Check";
import {User, UserApi} from "../../../api/v1/UserApi";

export default function UserTable(props: IUserTableProps) {
    const [globalState] = useGlobalState();
    const [data, setData] = useState<IPaginatedList<User>>(emptyPaginatedList<User>());
    const [showModal, setShowModal] = useState(false);
    const [updateUserId, setUpdateUserId] = useState<number|null>(null);
    const [loaded, setLoaded] = useState(false);
    const [queryRequest, setQueryRequest] = useState<IQueryRequest>(new QueryRequest());
    const [queryUpdated, setQueryUpdated] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        UserApi.find(props.clientId, queryRequest)
            .then(data => {
                setData(data);
                setLoaded(true);
            });
    }

    function deleteUser(id: number) {
        UserApi.delete(props.clientId, id)
            .then(_ => {
                refresh();
            });
    }

    if (queryUpdated) {
        refresh();
        setQueryUpdated(false);
    }

    function queryChange(query: IQueryRequest) {
        setQueryRequest(query);
        setQueryUpdated(true);
    }

    if (!loaded && props.clientId !== 0) {
        refresh();
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
                    <Breadcrumb.Item active>{t("users")}</Breadcrumb.Item>
                </Breadcrumb>
            </If>
            <If conditional={showModal}>
                <CreateOrUpdateUser clientId={props.clientId} userId={updateUserId}
                                    hide={() => setShowModal(false)} success={() => {
                    setShowModal(false);
                    refresh();
                }}/>
            </If>
            <DataTable onQueryChange={queryChange} title={t("users")} data={data} columns={[
                {label: t("name"), key: "name", sortable: true, render(user: User): JSX.Element {
                        if (globalState.user.clientId === props.clientId)
                            return <Link to={`/manage/users/${user.id}`}>{user.name}</Link>;
                        else return <Link to={`/admin/clients/${props.clientId}/manage/users/${user.id}`}>{user.name}</Link>;
                    }},
                {label: t("email"), key: "email", sortable: true},
                {label: t("disabled"), key: "disabled", sortable: true, render(user: User): JSX.Element {
                        return <Check value={user.disabled} />
                    }},
                {
                    label: t("role"), key: "role", sortable: true, render(user: User): JSX.Element {
                        return <UserRole value={user.role}/>
                    }
                },
                {
                    key: "rowActions", render: (user: User) => {
                        return (
                            <div className="float-right">
                                <UpdateIcon disabled={globalState.user.role < user.role} onClick={() => {
                                    setUpdateUserId(user.id);
                                    setShowModal(true);
                                }} />
                                <DeleteIcon disabled={globalState.user.role < user.role || globalState.user.id === user.id} onClick={() => {
                                    deleteUser(user.id);
                                }} />
                            </div>
                        )
                    }
                }
            ]} onPlusClick={() => {
                setUpdateUserId(null);
                setShowModal(true);
            }} />
        </div>
    );
}

export interface IUserTableProps {
    clientId: number;
}