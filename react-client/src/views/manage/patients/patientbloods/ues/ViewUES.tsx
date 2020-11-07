import {useTranslation} from "react-i18next";
import {Breadcrumb, Card} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {IndexLinkContainer} from "react-router-bootstrap";
import React, {useState} from "react";
import {BloodsUESApi, emptyUES} from "../../../../../api/v1/bloods/BloodsUESApi";

export function ViewUES(props: IUESProps) {
    const [UES, setUES] = useState(emptyUES());
    const {t} = useTranslation();
    const [queryUpdated, setQueryUpdated] = useState(false);
    const [loaded, setLoaded] = useState(false);

    function refresh() {
        BloodsUESApi.find(props.clientId, props.patientId)
            .then(data => {
                setUES(data);
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
                <Breadcrumb.Item active>{t("bloods-ues")}</Breadcrumb.Item>
            </Breadcrumb>
            <Card>
                <Card.Header>{t("bloods-ues")}</Card.Header>
                <Card.Body>
                    <Table>
                        <tbody>
                        <tr>
                            <th>{t("potassium")}</th>
                            <td>{UES.potassium}</td>
                        </tr>
                        <tr>
                            <th>{t("sodium")}</th>
                            <td>{UES.sodium}</td>
                        </tr>
                        <tr>
                            <th>{t("urea")}</th>
                            <td>{UES.urea}</td>
                        </tr>
                        <tr>
                            <th>{t("creatinine")}</th>
                            <td>{UES.creatinine}</td>
                        </tr>
                        <tr>
                            <th>{t("eGFR")}</th>
                            <td>{UES.egfr}</td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    )
}

export interface IUESProps {
    clientId: number;
    patientId: number;
}
