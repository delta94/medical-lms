import {useTranslation} from "react-i18next";
import {Breadcrumb, Card} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {IndexLinkContainer} from "react-router-bootstrap";
import React, {useState} from "react";
import {BloodsBL12FolateApi, emptyBL12Folate} from "../../../../../api/v1/bloods/BloodsBL12FolateApi";

export function ViewBL12(props: IBL12Props) {
    const [BL12, setBL12] = useState(emptyBL12Folate());
    const {t} = useTranslation();
    const [queryUpdated, setQueryUpdated] = useState(false);
    const [loaded, setLoaded] = useState(false);

    function refresh() {
        BloodsBL12FolateApi.find(props.clientId, props.patientId)
            .then(data => {
                setBL12(data);
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
                <Breadcrumb.Item active>{t("bloods-bl12")}</Breadcrumb.Item>
            </Breadcrumb>
            <Card>
                <Card.Header>{t("bloods-bl12")}</Card.Header>
                <Card.Body>
                    <Table>
                        <tbody>
                        <tr>
                            <th>{t("vitaminB12")}</th>
                            <td>{BL12.vitaminB12}</td>
                        </tr>
                        <tr>
                            <th>{t("folate")}</th>
                            <td>{BL12.folate}</td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    )
}

export interface IBL12Props {
    clientId: number;
    patientId: number;
}
