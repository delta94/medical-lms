import {useTranslation} from "react-i18next";
import {Breadcrumb, Card} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {IndexLinkContainer} from "react-router-bootstrap";
import React, {useState} from "react";
import {BloodsLFTSApi, emptyLFTS} from "../../../../../api/v1/bloods/BloodsLFTSApi";

export function ViewLFTS(props: ILFTSProps) {
    const [LFTS, setLFTS] = useState(emptyLFTS());
    const {t} = useTranslation();
    const [queryUpdated, setQueryUpdated] = useState(false);
    const [loaded, setLoaded] = useState(false);

    function refresh() {
        BloodsLFTSApi.find(props.clientId, props.patientId)
            .then(data => {
                setLFTS(data);
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
                <Breadcrumb.Item active>{t("bloods-lfts")}</Breadcrumb.Item>
            </Breadcrumb>
            <Card>
                <Card.Header>{t("bloods-lfts")}</Card.Header>
                <Card.Body>
                    <Table>
                        <tbody>
                        <tr>
                            <th>{t("alp")}</th>
                            <td>{LFTS.alp}</td>
                        </tr>
                        <tr>
                            <th>{t("alt")}</th>
                            <td>{LFTS.alt}</td>
                        </tr>
                        <tr>
                            <th>{t("bilirubin")}</th>
                            <td>{LFTS.bilirubin}</td>
                        </tr>
                        <tr>
                            <th>{t("albumin")}</th>
                            <td>{LFTS.albumin}</td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    )
}

export interface ILFTSProps {
    clientId: number;
    patientId: number;
}
