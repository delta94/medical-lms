import React, {useState} from "react";
import {ListGroup} from "react-bootstrap";
import {UpdateIcon} from "../../../../../components/CrudIcons";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import If from "../../../../../components/If";
import CreateOrUpdateCoagulation from "./CreateOrUpdateCoagulation";

export default function CoagulationComponent(props: ICoagulationProps) {
    const [showModal, setShowModal] = useState(false);

    const {t} = useTranslation();

    return (
        <div>
            <If conditional={showModal}>
                <CreateOrUpdateCoagulation clientId={props.clientId} patientId={props.patientId}
                                           hide={() => setShowModal(false)} success={() => {
                    setShowModal(false);
                }}/>
            </If>
            <ListGroup variant={"flush"}>
                <ListGroup.Item><Link
                    to={`/manage/patients/${props.patientId}/bloods/coagulation`}>{t("view-bloods-coagulation")}</Link><UpdateIcon
                    onClick={() => {
                        setShowModal(true);
                    }}/></ListGroup.Item>
            </ListGroup>
        </div>

    )

}

export interface ICoagulationProps {
    clientId: number;
    patientId: number;
}
