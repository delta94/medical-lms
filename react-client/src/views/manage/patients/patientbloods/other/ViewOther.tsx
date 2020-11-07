import {useTranslation} from "react-i18next";
import {Breadcrumb, Card} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {IndexLinkContainer} from "react-router-bootstrap";
import React, {useState} from "react";
import {BloodsOtherApi, emptyOther} from "../../../../../api/v1/bloods/BloodsOtherApi";

export function ViewOther(props: IOtherProps) {
    const [Other, setOther] = useState(emptyOther());
    const {t} = useTranslation();
    const [queryUpdated, setQueryUpdated] = useState(false);
    const [loaded, setLoaded] = useState(false);

    function refresh() {
        BloodsOtherApi.find(props.clientId, props.patientId)
            .then(data => {
                setOther(data);
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
                <Breadcrumb.Item active>{t("bloods-other")}</Breadcrumb.Item>
            </Breadcrumb>
            <Card>
                <Card.Header>{t("bloods-other")}</Card.Header>
                <Card.Body>
                    <Table>
                        <tbody>
                        <tr>
                            <th>{t("magnesium")}</th>
                            <td>{Other.magnesium}</td>
                        </tr>
                        <tr>
                            <th>{t("amylase")}</th>
                            <td>{Other.amylase}</td>
                        </tr>
                        <tr>
                            <th>{t("crp")}</th>
                            <td>{Other.crp}</td>
                        </tr>
                        <tr>
                            <th>{t("haematinics-ferritin")}</th>
                            <td>{Other.haematinicsFerritin}</td>
                        </tr>
                        <tr>
                            <th>{t("troponin-i")}</th>
                            <td>{Other.troponinI}</td>
                        </tr>
                        <tr>
                            <th>{t("hba1c")}</th>
                            <td>{Other.hba1c}</td>
                        </tr>
                        <tr>
                            <th>{t("lactate")}</th>
                            <td>{Other.lactate}</td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    )
}

export interface IOtherProps {
    clientId: number;
    patientId: number;
}
