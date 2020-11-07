import {useTranslation} from "react-i18next";
import {Breadcrumb, Card} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {IndexLinkContainer} from "react-router-bootstrap";
import React, {useState} from "react";
import {BloodsCoagulationApi, emptyCoagulation} from "../../../../../api/v1/bloods/BloodsCoagulationApi";

export function ViewCoagulation(props: ICoagulationProps) {
    const [Coagulation, setCoagulation] = useState(emptyCoagulation());
    const {t} = useTranslation();
    const [queryUpdated, setQueryUpdated] = useState(false);
    const [loaded, setLoaded] = useState(false);

    function refresh() {
        BloodsCoagulationApi.find(props.clientId, props.patientId)
            .then(data => {
                setCoagulation(data);
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
                <Breadcrumb.Item active>{t("bloods-coagulation")}</Breadcrumb.Item>
            </Breadcrumb>
            <Card>
                <Card.Header>{t("bloods-coagulation")}</Card.Header>
                <Card.Body>
                    <Table>
                        <tbody>
                        <tr>
                            <th>{t("pt")}</th>
                            <td>{Coagulation.pt}</td>
                        </tr>
                        <tr>
                            <th>{t("aptt")}</th>
                            <td>{Coagulation.aptt}</td>
                        </tr>
                        <tr>
                            <th>{t("fibrinogen")}</th>
                            <td>{Coagulation.fibrinogen}</td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    )
}

export interface ICoagulationProps {
    clientId: number;
    patientId: number;
}
