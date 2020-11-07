import React, {useState} from "react";
import If from "../../../components/If";
import {DataTable} from "../../../components/DataTable";
import {emptyPaginatedList, IPaginatedList, IQueryRequest, QueryRequest} from "../../../api/QueryRequest";
import {useTranslation} from "react-i18next";
import {DeleteIcon, UpdateIcon} from "../../../components/CrudIcons";
import {Scenario} from "../../../api/v1/ScenarioApi";
import {ScenarioSpeaker, ScenarioSpeakerApi} from "../../../api/v1/ScenarioSpeakerApi";
import CreateOrUpdateScenarioSpeaker from "./CreateOrUpdateScenarioSpeaker";
import Image from "react-bootstrap/Image";

export default function ScenarioSpeakerTable(props: IScenarioSpeakerTableProps) {
    const [showModal, setShowModal] = useState(false);
    const [updateScenarioSpeakerId, setUpdateScenarioSpeakerId] = useState<number | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [query, setQuery] = useState<IQueryRequest>(new QueryRequest());
    const [queryUpdated, setQueryUpdated] = useState(false);
    const {t} = useTranslation();
    const [data, setData] = useState<IPaginatedList<ScenarioSpeaker>>(emptyPaginatedList());

    function refresh() {
        ScenarioSpeakerApi.find(props.clientId, props.scenarioId, query)
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

    function deleteScenarioSpeaker(id: number) {
        ScenarioSpeakerApi.delete(props.clientId, props.scenarioId, id)
            .then(_ => {
                refresh();
            });
    }

    return (
        <div className={props.className ?? ""}>
            <If conditional={showModal}>
                <CreateOrUpdateScenarioSpeaker clientId={props.clientId} scenarioId={props.scenarioId}
                                               id={updateScenarioSpeakerId}
                                               hide={() => setShowModal(false)} success={() => {
                    setShowModal(false);
                    refresh();
                }}/>
            </If>
            <DataTable onQueryChange={queryChange} title={t("scenario-speakers")} data={data} columns={[
                {
                    label: t("name"), key: "name", sortable: true
                },
                {
                    label: t("avatar"),
                    key: "avatar",
                    sortable: false,
                    render(scenarioSpeaker: ScenarioSpeaker): JSX.Element {
                        if (scenarioSpeaker.avatar)
                            return <Image style={{objectFit: "cover", width: 100, height: 100}}
                                          src={scenarioSpeaker.avatar} roundedCircle alt={scenarioSpeaker.name} />;
                        else
                            return <span/>
                    }
                },
                {
                    key: "rowActions", render: (scenario: Scenario) => {
                        return (
                            <div className="float-right">
                                <UpdateIcon onClick={() => {
                                    setUpdateScenarioSpeakerId(scenario.id);
                                    setShowModal(true);
                                }}/>
                                <DeleteIcon onClick={() => {
                                    deleteScenarioSpeaker(scenario.id);
                                }}/>
                            </div>
                        )
                    }
                }
            ]} onPlusClick={() => {
                setUpdateScenarioSpeakerId(null);
                setShowModal(true);
            }}/>
        </div>
    )
}

export interface IScenarioSpeakerTableProps {
    clientId: number;
    scenarioId: number;
    className?: any;
}

