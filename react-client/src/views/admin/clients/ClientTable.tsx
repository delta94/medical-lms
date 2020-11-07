import {useGlobalState} from "state/GlobalState";
import React, {useState} from "react";
import {DataTable} from "components/DataTable";
import If from "components/If";
import {Client, ClientApi} from "api/v1/ClientApi";
import {CreateOrUpdateClient} from "views/admin/clients/CreateOrUpdateClient";
import {Link} from "react-router-dom";
import {emptyPaginatedList, IPaginatedList, IQueryRequest, QueryRequest} from "api/QueryRequest";
import {useTranslation} from "react-i18next";
import {DeleteIcon, UpdateIcon} from "../../../components/CrudIcons";
import {Check} from "../../../components/Check";
import Icon from "../../../components/Icon";

export default function ClientTable() {
    const [globalState] = useGlobalState();
    const [data, setData] = useState<IPaginatedList<Client>>(emptyPaginatedList());
    const [showModal, setShowModal] = useState(false);
    const [updateClientId, setUpdateClientId] = useState<number | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [query, setQuery] = useState<IQueryRequest>(new QueryRequest());
    const [queryUpdated, setQueryUpdated] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        ClientApi.find(query)
            .then(data => {
                setData(data);
                setLoaded(true);
            });
    }

    function deleteClient(id: number) {
        ClientApi.delete(id)
            .then(_ => {
                refresh();
            });
    }

    if (!loaded) {
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
            <If conditional={showModal}>
                <CreateOrUpdateClient clientId={updateClientId}
                                      hide={() => setShowModal(false)} success={() => {
                    setShowModal(false);
                    refresh();
                }}/>
            </If>
            <DataTable onQueryChange={queryChange} title={t("clients")} data={data} columns={[
                {
                    label: t("name"), key: "name", sortable: true, render: (client: Client) => {
                        return <Link to={`/admin/clients/${client.id}`}>{client.name}</Link>
                    }
                },
                { label: t("subdomain"), key: "subdomain", sortable: true },
                {
                    label: t("disabled"), key: "disabled", sortable: true, render(client: Client): JSX.Element {
                        return <Check value={client.disabled}/>
                    }
                },
                {
                    key: "rowActions", render: (client: Client) => {
                        return (
                            <div className="float-right">
                                <Icon invokeDefault={true} to={`/admin/clients/${client.id}/features`} title={t("feature-flags")}>flag</Icon>
                                <UpdateIcon onClick={() => {
                                    setUpdateClientId(client.id);
                                    setShowModal(true);
                                }}/>
                                <DeleteIcon disabled={globalState.user.clientId === client.id}
                                            onClick={() => deleteClient(client.id)}/>
                            </div>
                        )
                    }
                }
            ]} onPlusClick={() => {
                setUpdateClientId(null);
                setShowModal(true);
            }}/>
        </div>
    );
}