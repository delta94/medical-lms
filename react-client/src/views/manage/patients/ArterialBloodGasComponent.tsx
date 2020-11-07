import React, {useState} from "react";
import If, {Else, Then} from "../../../components/If";
import {Button, Card, ListGroup} from "react-bootstrap";
import {UpdateIcon} from "../../../components/CrudIcons";
import {useTranslation} from "react-i18next";
import Icon from "../../../components/Icon";
import {Link} from "react-router-dom";
import {ArterialBloodGasApi, emptyArterialBloodGas} from "../../../api/v1/ArterialBloodGasApi";
import CreateOrUpdateArterialBloodGas from "./CreateOrUpdateArterialBloodGas";

export default function ArterialBloodGasComponent(props: IArterialBloodGasProps) {
    const [showModal, setShowModal] = useState(false);
    const [arterialBloodGas, setArterialBloodGas] = useState(emptyArterialBloodGas());
    const [loaded, setLoaded] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        ArterialBloodGasApi.find(props.clientId, props.patientId)
            .then(data => {
                setArterialBloodGas(data);
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
                <CreateOrUpdateArterialBloodGas clientId={props.clientId} patientId={props.patientId}
                                            hide={() => setShowModal(false)} success={() => {
                    setShowModal(false);
                    refresh();
                }} updating={arterialBloodGas.clientId !== 0}/>
            </If>
            <Card>
                <Card.Header>
                    {t("abg")}
                    <If conditional={arterialBloodGas.clientId === 0}>
                        <Button className="float-right rounded-pill" variant="primary" size={"sm"}
                                onClick={() => {
                                    setShowModal(true);
                                }}>
                            <Icon className="text-white align-bottom">add</Icon>
                        </Button>
                    </If>
                </Card.Header>
                <Card.Body>
                    <If conditional={arterialBloodGas.clientId === 0} hasElse={true}>
                        <Then>
                            <h4>{t("no-abg")}</h4>
                        </Then>
                        <Else>
                            <ListGroup variant={"flush"}>
                                <ListGroup.Item><Link
                                    to={`/manage/patients/${props.patientId}/abg`}>{t("view-abg")}</Link><UpdateIcon
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

export interface IArterialBloodGasProps {
    clientId: number;
    patientId: number;
}
