import React, {useState} from "react";
import {emptyPaginatedList, IPaginatedList, IQueryRequest, QueryRequest} from "../../../../api/QueryRequest";
import {useTranslation} from "react-i18next";
import If from "../../../../components/If";
import {DataTable} from "../../../../components/DataTable";
import {Environment, ScenarioEnvironmentApi} from "../../../../api/v1/ScenarioEnvironmentApi";
import {UpdateIcon} from "../../../../components/CrudIcons";
import Image from "react-bootstrap/Image";
import CreateOrUpdateEnvironment from "./CreateOrUpdateEnvironment";

export default function ScenarioEnvironmentTable(props: IScenarioEnvironmentTableProps) {
    const [data, setData] = useState<IPaginatedList<Environment>>(emptyPaginatedList());
    const [showModal, setShowModal] = useState(false);
    const [updateEnvironmentId, setUpdateEnvironmentId] = useState<number | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [query, setQuery] = useState<IQueryRequest>(new QueryRequest());
    const [queryUpdated, setQueryUpdated] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        ScenarioEnvironmentApi.find(props.clientId, props.scenarioId, query)
            .then(data => {
                setData(data);
                setLoaded(true);
            });
    }

    if (!loaded && props.clientId !== 0 && props.scenarioId !== 0) {
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
                <CreateOrUpdateEnvironment clientId={props.clientId} scenarioId={props.scenarioId} environmentId={updateEnvironmentId} hide={() => setShowModal(false)} success={() => {
                    setShowModal(false);
                    refresh();
                }} />
            </If>
            <DataTable onQueryChange={queryChange} title={t("environments")} data={data} columns={[
                {label: t("name"), key: "name", sortable: true},
                {label: t("preview"), key: "preview", sortable: false, render: (environment: Environment) => {
                        return (
                            <If conditional={environment.image}>
                                <Image width="400" fluid={true} src={environment.image} alt={environment.name}/>
                            </If>       
                        );
                    }
                },
                {
                    key: "rowActions", render: (environment: Environment) => {
                        return (
                            <div className="float-right">
                                <UpdateIcon onClick={() => {
                                    setUpdateEnvironmentId(environment.id);
                                    setShowModal(true);
                                }} />
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

export interface IScenarioEnvironmentTableProps {
    clientId: number;
    scenarioId: number;
    className?: any;
}