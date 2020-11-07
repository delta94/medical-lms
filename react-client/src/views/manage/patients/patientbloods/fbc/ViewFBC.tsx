import {useTranslation} from "react-i18next";
import {Breadcrumb, Card} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {IndexLinkContainer} from "react-router-bootstrap";
import React, {useState} from "react";
import {BloodsFBCApi, emptyFBC} from "../../../../../api/v1/bloods/BloodsFBCApi";

export function ViewFBC(props: IFBCProps) {
    const [Fbc, setFbc] = useState(emptyFBC());
    const {t} = useTranslation();
    const [queryUpdated, setQueryUpdated] = useState(false);
    const [loaded, setLoaded] = useState(false);

    function refresh() {
        BloodsFBCApi.find(props.clientId, props.patientId)
            .then(data => {
                setFbc(data);
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
                <Breadcrumb.Item active>{t("bloods-fbc")}</Breadcrumb.Item>
            </Breadcrumb>
            <Card>
                <Card.Header>{t("bloods-fbc")}</Card.Header>
                <Card.Body>
                    <Table>
                        <tbody>
                        <tr>
                            <th>{t("hb")}</th>
                            <td>{Fbc.hb}</td>
                        </tr>
                        <tr>
                            <th>{t("mcv")}</th>
                            <td>{Fbc.mcv}</td>
                        </tr>
                        <tr>
                            <th>{t("mch")}</th>
                            <td>{Fbc.mch}</td>
                        </tr>
                        <tr>
                            <th>{t("totalWCC")}</th>
                            <td>{Fbc.totalWcc}</td>
                        </tr>
                        <tr>
                            <th>{t("neutrophils")}</th>
                            <td>{Fbc.neutrophils}</td>
                        </tr>
                        <tr>
                            <th>{t("lymphocytes")}</th>
                            <td>{Fbc.lymphocytes}</td>
                        </tr>
                        <tr>
                            <th>{t("monocytes")}</th>
                            <td>{Fbc.monocytes}</td>
                        </tr>
                        <tr>
                            <th>{t("eosinophils")}</th>
                            <td>{Fbc.eosinophils}</td>
                        </tr>
                        <tr>
                            <th>{t("platelets")}</th>
                            <td>{Fbc.platelets}</td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    )
}

export interface IFBCProps {
    clientId: number;
    patientId: number;
}
