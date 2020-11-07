import React, {useState} from "react";
import {INodeProps} from "../../case-logic/graph-nodes/GraphNode";
import {emptyPaginatedList, QueryRequest} from "../../api/QueryRequest";
import {Patient} from "../../api/v1/PatientApi";
import {ScenarioApi} from "../../api/v1/ScenarioApi";
import {useTranslation} from "react-i18next";
import CardColumns from "react-bootstrap/CardColumns";
import Card from "react-bootstrap/Card";


export function SelectPatientComponent(props: INodeProps){
    const [patients, setPatients] = useState(emptyPaginatedList<Patient>());
    const [initialised, setInitialised] = useState(false);

    const {t} = useTranslation();

    if (!initialised) {
        setInitialised(true);

        ScenarioApi.findPatients(props.state.clientId, props.state.scenarioId, new QueryRequest(1, 20)).then(value => {
            setPatients(value);
        });
    }

    return (
        <div>
            <h2>{t("select-patient")}</h2>
            <CardColumns className="mt-5">
                {patients.list.map((patient) => {
                    return (
                        <Card key={patient.id} onClick={() => {
                            props.state.addPatient(patient);
                            props.progress(0);
                        }} className="clickable">
                            <Card.Header>{patient.name}</Card.Header>
                            <Card.Body>
                                {patient.description}
                            </Card.Body>
                        </Card>
                    );
                })}
            </CardColumns>
        </div>
    );
}