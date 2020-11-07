import {useTranslation} from "react-i18next";
import {Breadcrumb, Card} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {IndexLinkContainer} from "react-router-bootstrap";
import React, {useState} from "react";
import {BloodsTFTSApi, emptyTFTS} from "../../../../../api/v1/bloods/BloodsTFTSApi";

export function ViewTFTS(props: ITFTSProps) {
    const [TFTS, setTFTS] = useState(emptyTFTS());
    const {t} = useTranslation();
    const [queryUpdated, setQueryUpdated] = useState(false);
    const [loaded, setLoaded] = useState(false);

    function refresh() {
        BloodsTFTSApi.find(props.clientId, props.patientId)
            .then(data => {
                setTFTS(data);
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
                <Breadcrumb.Item active>{t("bloods-tfts")}</Breadcrumb.Item>
            </Breadcrumb>
            <Card>
                <Card.Header>{t("bloods-tfts")}</Card.Header>
                <Card.Body>
                    <Table>
                        <tbody>
                        <tr>
                            <th>{t("tsh")}</th>
                            <td>{TFTS.tsh}</td>
                        </tr>
                        <tr>
                            <th>{t("free-t4")}</th>
                            <td>{TFTS.freeT4}</td>
                        </tr>
                        <tr>
                            <th>{t("free-t3")}</th>
                            <td>{TFTS.freeT3}</td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    )
}

export interface ITFTSProps {
    clientId: number;
    patientId: number;
}
