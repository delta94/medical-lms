import React, {useState} from "react";
import {User} from "api/v1/UserApi";
import {DataTable} from "components/DataTable";
import If from "components/If";
import Icon from "components/Icon";
import {emptyPaginatedList, IPaginatedList, IQueryRequest, QueryRequest} from "../../../../api/QueryRequest";
import {useTranslation} from "react-i18next";
import {ScenarioApi} from "../../../../api/v1/ScenarioApi";
import {Patient} from "../../../../api/v1/PatientApi";
import AddPatient from "./AddPatient";

export default function ScenarioPatientTable(props: IScenarioPatientTableProps) {
    const [data, setData] = useState<IPaginatedList<Patient>>(emptyPaginatedList());
    const [showModal, setShowModal] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [query, setQuery] = useState<IQueryRequest>(new QueryRequest());
    const [queryUpdated, setQueryUpdated] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        ScenarioApi.findPatients(props.clientId, props.scenarioId, query)
            .then(data => {
                setData(data);
                setLoaded(true);
            });
    }

    function removePatient(id: number) {
        ScenarioApi.removePatient(props.clientId, props.scenarioId, id)
            .then(_ => {
                refresh();
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
                <AddPatient clientId={props.clientId} scenarioId={props.scenarioId}
                           hide={() => setShowModal(false)}
                           confirm={() => {
                               setShowModal(false);
                               refresh();
                           }}/>
            </If>
            <DataTable onQueryChange={queryChange} title={t("scenario-patients")} data={data} columns={[
                {label: t("name"), key: "name", sortable: true},
                {label: t("description"), key: "description", sortable: true},
                {
                    key: "rowActions", render: (user: User) => {
                        return (
                            <div className="float-right">
                                <Icon title={t("remove")} href="#" onClick={() => {
                                    removePatient(user.id);
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

export interface IScenarioPatientTableProps {
    clientId: number;
    scenarioId: number;
    className?: any;
}