import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Breadcrumb, Card} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {Check} from "../../../components/Check";
import {ClerkingInfoApi, emptyClerkingInfo} from "../../../api/v1/ClerkingInfoApi";
import {IndexLinkContainer} from "react-router-bootstrap";

export function ClerkingInfoView(props: IClerkingInfoProps) {
    const [clerkingInfo, setClerkingInfo] = useState(emptyClerkingInfo());
    const {t} = useTranslation();
    const [loaded, setLoaded] = useState(false);

    if (!loaded && props.clientId !== 0) {
        ClerkingInfoApi.find(props.clientId, props.patientId)
            .then(data => {
                setLoaded(true);
                setClerkingInfo(data);
            })
            .catch(error => {
                //TODO handle better
                setLoaded(true);
            });
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
                <Breadcrumb.Item active>{t("clerking-information")}</Breadcrumb.Item>
            </Breadcrumb>
            <Card>
                <Card.Header>{t("clerking-information")}</Card.Header>
                <Card.Body>
                    <Table>
                        <tbody>
                        <tr>
                            <th>{t("current-complaint-history")}</th>
                            <td>{clerkingInfo.currentComplaintHistory}</td>
                        </tr>
                        <tr>
                            <th>{t("drug-history")}</th>
                            <td>{clerkingInfo.drugHistory}</td>
                        </tr>
                        <tr>
                            <th>{t("family-history")}</th>
                            <td>{clerkingInfo.familyHistory}</td>
                        </tr>
                        <tr>
                            <th>{t("smoking-status")}</th>
                            <td><Check value={clerkingInfo.smokingStatus}/></td>
                        </tr>
                        <tr>
                            <th>{t("alcohol-consumption")}</th>
                            <td>{clerkingInfo.alcoholConsumption}</td>
                        </tr>
                        <tr>
                            <th>{t("systemic-review")}</th>
                            <td>{clerkingInfo.systemicReview}</td>
                        </tr>
                        <tr>
                            <th>{t("performance-status")}</th>
                            <td>{clerkingInfo.performanceStatus}</td>
                        </tr>
                        <tr>
                            <th>{t("allergies")}</th>
                            <td>{clerkingInfo.allergies}</td>
                        </tr>
                        <tr>
                            <th>{t("adl")}</th>
                            <td>{clerkingInfo.adl}</td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    )
}

export interface IClerkingInfoProps {
    clientId: number;
    patientId: number;
}
