import React, {useState} from "react";
import If, {Else, Then} from "../../../components/If";
import {Button, Card, ListGroup} from "react-bootstrap";
import {UpdateIcon} from "../../../components/CrudIcons";
import {useTranslation} from "react-i18next";
import {ClerkingInfoApi, emptyClerkingInfo} from "../../../api/v1/ClerkingInfoApi";
import CreateOrUpdateClerkingInfo from "./CreateOrUpdateClerkingInfo";
import Icon from "../../../components/Icon";
import {Link} from "react-router-dom";

export default function ClerkingInfoComponent(props: IClerkingInfoProps) {
    const [showModal, setShowModal] = useState(false);
    const [clerkingInfo, setClerkingInfo] = useState(emptyClerkingInfo());
    const [loaded, setLoaded] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        ClerkingInfoApi.find(props.clientId, props.patientId)
            .then(data => {
                setClerkingInfo(data);
            })
            .catch(err => {

            });
    }

    if (!loaded && props.clientId !== 0) {
        setLoaded(true);
        refresh();
    }

    return (
        <div>
            <If conditional={showModal}>
                <CreateOrUpdateClerkingInfo clientId={props.clientId} patientId={props.patientId}
                                            hide={() => setShowModal(false)} success={() => {
                    setShowModal(false);
                    refresh();
                }} updating={clerkingInfo.clientId !== 0}/>
            </If>
            <Card>
                <Card.Header>
                    {t("clerking-information")}
                    <If conditional={clerkingInfo.clientId === 0}>
                        <Button className="float-right rounded-pill" variant="primary" size={"sm"}
                                onClick={() => {
                                    setShowModal(true);
                                }}>
                            <Icon className="text-white align-bottom">add</Icon>
                        </Button>
                    </If>
                </Card.Header>
                <Card.Body>
                    <If conditional={clerkingInfo.clientId === 0} hasElse={true}>
                        <Then>
                            <h4>{t("no-clerking-info-available")}</h4>
                        </Then>
                        <Else>
                            <ListGroup variant={"flush"}>
                                <ListGroup.Item><Link
                                    to={`/manage/patients/${props.patientId}/clerking`}>{t("view-clerking-information")}</Link><UpdateIcon
                                    onClick={() => {
                                        setShowModal(true);
                                    }}/></ListGroup.Item>
                            </ListGroup>
                        </Else>
                    </If>
                </Card.Body>
            </Card>
        </div>

    )

}

export interface IClerkingInfoProps {
    clientId: number;
    patientId: number;
}
