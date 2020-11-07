import {useTranslation} from "react-i18next";
import {Breadcrumb, Card} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {IndexLinkContainer} from "react-router-bootstrap";
import React, {useState} from "react";
import {ArterialBloodGasApi, emptyArterialBloodGas} from "../../../api/v1/ArterialBloodGasApi";

export function ArterialBloodGasView(props: IBoneProfileProps) {
    const [arterialBloodGas, setArterialBloodGas] = useState(emptyArterialBloodGas());
    const {t} = useTranslation();
    const [queryUpdated, setQueryUpdated] = useState(false);
    const [loaded, setLoaded] = useState(false);

    function refresh() {
        ArterialBloodGasApi.find(props.clientId, props.patientId)
            .then(data => {
                setArterialBloodGas(data);
                setLoaded(true);
            });
    }


    if (queryUpdated) {
        refresh();
        setQueryUpdated(false);
    }

    if (!loaded && props.clientId !== 0) {
        refresh();
    }

    return (
        <div>
            <Breadcrumb>
                <IndexLinkContainer to="/manage/patients">
                    <Breadcrumb.Item>{t("patients")}</Breadcrumb.Item>
                </IndexLinkContainer>
                <IndexLinkContainer to={`/manage/patients/${props.patientId}`}>
                    <Breadcrumb.Item>{t("manage")}</Breadcrumb.Item>
                </IndexLinkContainer>
                <Breadcrumb.Item active>{t("patient-abg")}</Breadcrumb.Item>
            </Breadcrumb>
            <Card>
                <Card.Header>{t("abg")}</Card.Header>
                <Card.Body>
                    <Table>
                        <tbody>
                        <tr>
                            <th>pH</th>
                            <td>{arterialBloodGas.ph}</td>
                        </tr>
                        <tr>
                            <th>PaO<sub>2</sub></th>
                            <td>{arterialBloodGas.pao2}</td>
                        </tr>
                        <tr>
                            <th>PaCO<sub>2</sub></th>
                            <td>{arterialBloodGas.paco2}</td>
                        </tr>
                        <tr>
                            <th>HCO<sub>3</sub></th>
                            <td>{arterialBloodGas.hco3}</td>
                        </tr>
                        <tr>
                            <th>{t("base-excess")}</th>
                            <td>{arterialBloodGas.baseExcess}</td>
                        </tr>
                        <tr>
                            <th>{t("lactate")}</th>
                            <td>{arterialBloodGas.lactate}</td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    )
}

export interface IBoneProfileProps {
    clientId: number;
    patientId: number;
}
