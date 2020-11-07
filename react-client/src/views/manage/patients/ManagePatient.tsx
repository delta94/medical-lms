import React, {useState} from "react";
import {Card, Nav, Tab} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {FormattedDate} from "../../../components/FormatedDate";
import Table from "react-bootstrap/Table";
import {calcBMI, emptyPatient, PatientApi} from "../../../api/v1/PatientApi";
import PhysicalExamResultsComponent from "./PhysicalExamResultsComponent";
import FBCComponent from "./patientbloods/fbc/FBCComponent";
import BL12Component from "./patientbloods/bl12/BL12Component";
import BoneProfileComponent from "./patientbloods/boneprofile/BoneProfileComponent";
import CoagulationComponent from "./patientbloods/coagulation/CoagulationComponent";
import LFTSComponent from "./patientbloods/lfts/LFTSComponent";
import OtherComponent from "./patientbloods/other/OtherComponent";
import TFTSComponent from "./patientbloods/tfts/TFTSComponent";
import UESComponent from "./patientbloods/ues/UESComponent";
import ClerkingInfoComponent from "./ClerkingInfoComponent";
import ArterialBloodGasComponent from "./ArterialBloodGasComponent";

export function ManagePatient(props: IManagePatientProps) {
    const [patient, setPatient] = useState(emptyPatient());
    const {t} = useTranslation();
    const [loaded, setLoaded] = useState(false);

    if (!loaded && props.clientId !== 0) {
        PatientApi.findById(props.clientId, props.patientId)
            .then(data => {
                setLoaded(true);
                setPatient(data);
            });
    }

    return (
        <div>
            <Card>
                <Card.Header>{t("details")}</Card.Header>
                <Card.Body>
                    <Table>
                        <tbody>
                        <tr>
                            <th>{t("name")}</th>
                            <td>{patient.name}</td>
                        </tr>
                        <tr>
                            <th>{t("description")}</th>
                            <td>{patient.description}</td>
                        </tr>
                        <tr>
                            <th>{t("ethnicity")}</th>
                            <td>{patient.ethnicity}</td>
                        </tr>
                        <tr>
                            <th>{t("age")}</th>
                            <td>{patient.age}</td>
                        </tr>
                        <tr>
                            <th>{t("sex")}</th>
                            <td>
                                {patient.isFemale
                                    ? t("female")
                                    : t("male")
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>{t("weight")}</th>
                            <td>{patient.weight}Kg</td>
                        </tr>
                        <tr>
                            <th>{t("height")}</th>
                            <td>{patient.height}M</td>
                        </tr>
                        <tr>
                            <th>BMI</th>
                            <td>{calcBMI(patient)}</td>
                        </tr>
                        <tr>
                            <th>{t("created-at")}</th>
                            <td><FormattedDate date={patient.createdAt}/></td>
                        </tr>
                        <tr>
                            <th>{t("updated-at")}</th>
                            <td><FormattedDate date={patient.updatedAt}/></td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <br />
            <br />
            <Tab.Container defaultActiveKey="physical-exam">
                <Nav variant="tabs">
                    <Nav.Item>
                        <Nav.Link eventKey="physical-exam">{t("physical-exam-regions")}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="clerking">{t("clerking-information")}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="bloods">{t("blood-results")}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="abg">{t("abg")}</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey="physical-exam">
                        <PhysicalExamResultsComponent clientId={props.clientId} patientId={props.patientId}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="clerking">
                        <ClerkingInfoComponent clientId={props.clientId} patientId={props.patientId}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="bloods">
                        <Card>
                            <Card.Header>{t("blood-results")}</Card.Header>
                            <Card.Body>
                                <FBCComponent clientId={props.clientId} patientId={props.patientId}/>
                                <BL12Component clientId={props.clientId} patientId={props.patientId}/>
                                <BoneProfileComponent clientId={props.clientId} patientId={props.patientId}/>
                                <CoagulationComponent clientId={props.clientId} patientId={props.patientId}/>
                                <LFTSComponent clientId={props.clientId} patientId={props.patientId}/>
                                <TFTSComponent clientId={props.clientId} patientId={props.patientId}/>
                                <UESComponent clientId={props.clientId} patientId={props.patientId}/>
                                <OtherComponent clientId={props.clientId} patientId={props.patientId}/>
                            </Card.Body>
                        </Card>
                    </Tab.Pane>
                    <Tab.Pane eventKey="abg">
                        <ArterialBloodGasComponent clientId={props.clientId} patientId={props.patientId}/>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    );
}

export interface IManagePatientProps {
    clientId: number;
    patientId: number;
}
