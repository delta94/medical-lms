import {useTranslation} from "react-i18next";
import {Breadcrumb, Card} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {IndexLinkContainer} from "react-router-bootstrap";
import React, {useState} from "react";
import {BloodsBoneProfileApi, emptyBoneProfile} from "../../../../../api/v1/bloods/BloodsBoneProfileApi";

export function ViewBoneProfile(props: IBoneProfileProps) {
    const [BoneProfile, setBoneProfile] = useState(emptyBoneProfile());
    const {t} = useTranslation();
    const [queryUpdated, setQueryUpdated] = useState(false);
    const [loaded, setLoaded] = useState(false);

    function refresh() {
        BloodsBoneProfileApi.find(props.clientId, props.patientId)
            .then(data => {
                setBoneProfile(data);
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
                <Breadcrumb.Item active>{t("bloods-bone-profile")}</Breadcrumb.Item>
            </Breadcrumb>
            <Card>
                <Card.Header>{t("bloods-bone-profile")}</Card.Header>
                <Card.Body>
                    <Table>
                        <tbody>
                        <tr>
                            <th>{t("corrected-calcium")}</th>
                            <td>{BoneProfile.correctedCalcium}</td>
                        </tr>
                        <tr>
                            <th>{t("alp")}</th>
                            <td>{BoneProfile.alp}</td>
                        </tr>
                        <tr>
                            <th>{t("phosphate")}</th>
                            <td>{BoneProfile.phosphate}</td>
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
