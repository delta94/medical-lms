import React, {useState} from "react";
import {Breadcrumb} from "react-bootstrap";
import If from "../../../components/If";
import CreateOrUpdateResource from "./CreateOrUpdateResource";
import {useGlobalState} from "state/GlobalState";
import {Resource, ResourceApi} from "../../../api/v1/ResourceApi"
import {DataTable} from "../../../components/DataTable";
import {Link} from "react-router-dom";
import {emptyPaginatedList, IPaginatedList, IQueryRequest, QueryRequest} from "../../../api/QueryRequest";
import {useTranslation} from "react-i18next";
import {DeleteIcon, UpdateIcon} from "../../../components/CrudIcons";
import {IndexLinkContainer} from "react-router-bootstrap";

export default function ResourceTable(props: IResourceTableProps) {
    const [showModal, setShowModal] = useState(false);
    const [updateResourceId, setUpdateResourceId] = useState<number | null>(null);
    const [globalState] = useGlobalState();
    const [data, setData] = useState<IPaginatedList<Resource>>(emptyPaginatedList());
    const [loaded, setLoaded] = useState(false);
    const [query, setQuery] = useState<IQueryRequest>(new QueryRequest());
    const [queryUpdated, setQueryUpdated] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        ResourceApi.find(props.clientId, query)
            .then(data => {
                setData(data);
                setLoaded(true);
            });
    }

    function deleteResource(id: number) {
        ResourceApi.delete(props.clientId, id)
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
                    <Breadcrumb.Item active>{t("resources")}</Breadcrumb.Item>
                </Breadcrumb>
            </If>
            <If conditional={showModal}>
                <CreateOrUpdateResource clientId={props.clientId} resourceId={updateResourceId}
                                        hide={() => setShowModal(false)} success={() => {
                    setShowModal(false);
                    refresh();
                }}/>
            </If>
            <DataTable onQueryChange={queryChange} title={t("resources")} data={data} columns={[
                {
                    label: t("name"), key: "name", sortable: true, render(resource: Resource): JSX.Element {
                        if (globalState.user.clientId === props.clientId)
                            return <Link to={`/manage/resources/${resource.id}`}>{resource.name}</Link>;
                        else return <Link
                            to={`/admin/clients/${props.clientId}/manage/resources/${resource.id}`}>{resource.name}</Link>;
                    }
                },
                {label: t("category"), key: "type", sortable: true},
                {label: t("description"), key: "description", sortable: true},
                {
                    key: "rowActions", render: (resource: Resource) => {
                        return (
                            <div className="float-right">
                                <UpdateIcon onClick={() => {
                                    setUpdateResourceId(resource.id);
                                    setShowModal(true);
                                }}/>
                                <DeleteIcon onClick={() => {
                                    deleteResource(resource.id);
                                }}/>
                            </div>
                        )
                    }
                }
            ]} onPlusClick={() => {
                setUpdateResourceId(null);
                setShowModal(true);
            }}/>

        </div>
    )
}

export interface IResourceTableProps {
    clientId: number;
}
