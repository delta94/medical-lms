import React, {useState} from "react";
import CreateOrUpdateScenario from "./CreateOrUpdateScenario";
import If from "../../../components/If";
import {Link} from "react-router-dom";
import {DataTable} from "../../../components/DataTable";
import {emptyPaginatedList, IPaginatedList, IQueryRequest, QueryRequest} from "../../../api/QueryRequest";
import {useGlobalState} from "../../../state/GlobalState";
import {useTranslation} from "react-i18next";
import {UpdateIcon} from "../../../components/CrudIcons";
import {Scenario, ScenarioApi} from "../../../api/v1/ScenarioApi";
import {Check} from "../../../components/Check";

export default function ScenarioTable(props: IScenarioTableProps) {
    const [showModal, setShowModal] = useState(false);
    const [updateScenarioId, setUpdateScenarioId] = useState<number | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [query, setQuery] = useState<IQueryRequest>(new QueryRequest());
    const [queryUpdated, setQueryUpdated] = useState(false);
    const [globalState] = useGlobalState();
    const {t} = useTranslation();
    const [data, setData] = useState<IPaginatedList<Scenario>>(emptyPaginatedList());

    function refresh() {
        ScenarioApi.find(props.clientId, query)
            .then(data => {
                setData(data);
                setLoaded(true);
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
            <If conditional={showModal}>
                <CreateOrUpdateScenario clientId={props.clientId} scenarioId={updateScenarioId}
                                        hide={() => setShowModal(false)} success={() => {
                    setShowModal(false);
                    refresh();
                }}/>
            </If>
            <DataTable onQueryChange={queryChange} title={t("scenarios")} data={data} columns={[
                {
                    label: t("name"), key: "name", sortable: true, render(scenario: Scenario): JSX.Element {
                        if (globalState.user.clientId === props.clientId)
                            return <Link to={`/manage/scenarios/${scenario.id}`}>{scenario.name}</Link>;
                        else return <Link
                            to={`/admin/clients/${props.clientId}/manage/scenarios/${scenario.id}`}>{scenario.name}</Link>;
                    }
                },
                {label: t("description"), key: "description", sortable: true},
                {
                    label: t("cover-image"), key: "coverImage", sortable: false, render(scenario: Scenario): JSX.Element {
                        if (scenario.coverImage)
                            return <img width={100} className="img-fluid" src={scenario.coverImage} alt={scenario.name} />;
                        else
                            return <span/>
                    }
                },
                {
                    label: t("active"), key: "active", sortable: true, render(scenario: Scenario): JSX.Element {
                        return <Check value={scenario.active}/>
                    }
                },
                {
                    key: "rowActions", render: (scenario: Scenario) => {
                        return (
                            <div className="float-right">
                                <UpdateIcon onClick={() => {
                                    setUpdateScenarioId(scenario.id);
                                    setShowModal(true);
                                }}/>
                            </div>
                        )
                    }
                }
            ]} onPlusClick={() => {
                setUpdateScenarioId(null);
                setShowModal(true);
            }}/>
        </div>
    )
}

export interface IScenarioTableProps {
    clientId: number;
}

