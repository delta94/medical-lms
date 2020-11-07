import React, {useState} from "react";
import CreateOrUpdatePatient from "./CreateOrUpdatePatient";
import If from "../../../components/If";
import {Link} from "react-router-dom";
import {DataTable} from "../../../components/DataTable";
import {emptyPaginatedList, IPaginatedList, IQueryRequest, QueryRequest} from "../../../api/QueryRequest";
import {useGlobalState} from "../../../state/GlobalState";
import {useTranslation} from "react-i18next";
import {Patient, PatientApi} from "../../../api/v1/PatientApi";
import {DeleteIcon, UpdateIcon} from "../../../components/CrudIcons";

export default function PatientTable(props: IPatientsTableProps) {
    const [showModal, setShowModal] = useState(false);
    const [updatePatientId, setUpdatePatientId] = useState<number | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [query, setQuery] = useState<IQueryRequest>(new QueryRequest());
    const [queryUpdated, setQueryUpdated] = useState(false);
    const [globalState] = useGlobalState();
    const {t} = useTranslation();
    const [data, setData] = useState<IPaginatedList<Patient>>(emptyPaginatedList());

    function refresh() {
        PatientApi.find(props.clientId, query)
            .then(data => {
                setData(data);
                setLoaded(true);
            });
    }

    function deletePatient(id: number) {
        PatientApi.delete(props.clientId, id)
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
            <If conditional={showModal}>
                <CreateOrUpdatePatient clientId={props.clientId} patientId={updatePatientId}
                                       hide={() => setShowModal(false)} success={() => {
                    setShowModal(false);
                    refresh();
                }}/>
            </If>
            <DataTable onQueryChange={queryChange} title={t("patients")} data={data} columns={[
                {
                    label: t("name"), key: "name", sortable: true, render(patient: Patient): JSX.Element {
                        if (globalState.user.clientId === props.clientId)
                            return <Link to={`/manage/patients/${patient.id}`}>{patient.name}</Link>;
                        else return <Link
                            to={`/admin/clients/${props.clientId}/manage/patients/${patient.id}`}>{patient.name}</Link>;
                    }
                },
                {label: t("description"), key: "description", sortable: true},
                {label: t("age"), key: "age", sortable: true},
                {
                    label: t("height"), key: "height", sortable: true, render(patient: Patient): JSX.Element {
                        return <span>{patient.height}M</span>
                    }
                },
                {
                    label: t("weight"), key: "weight", sortable: true, render(patient: Patient): JSX.Element {
                        return <span>{patient.weight}Kg</span>
                    }
                },
                {label: t("ethnicity"), key: "ethnicity", sortable: true},
                {
                    key: "rowActions", render: (patient: Patient) => {
                        return (
                            <div className="float-right">
                                <UpdateIcon onClick={() => {
                                    setUpdatePatientId(patient.id);
                                    setShowModal(true);
                                }}/>
                                <DeleteIcon onClick={() => {
                                    deletePatient(patient.id);
                                }}/>
                            </div>
                        )
                    }
                }
            ]} onPlusClick={() => {
                setUpdatePatientId(null);
                setShowModal(true);
            }}/>
        </div>
    )
}

export interface IPatientsTableProps {
    clientId: number;
}

