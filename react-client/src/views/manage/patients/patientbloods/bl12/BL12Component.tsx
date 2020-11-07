import React, {useState} from "react";
import {ListGroup} from "react-bootstrap";
import {UpdateIcon} from "../../../../../components/CrudIcons";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import If from "../../../../../components/If";
import CreateOrUpdateBL12Folate from "./CreateOrUpdateBL12Folate";

export default function BL12Component(props: IBL12FolateProps) {
    const [showModal, setShowModal] = useState(false);

    const {t} = useTranslation();


    return (
        <div>
            <If conditional={showModal}>
                <CreateOrUpdateBL12Folate clientId={props.clientId} patientId={props.patientId}
                                   hide={() => setShowModal(false)} success={() => {
                    setShowModal(false);
                }} />
            </If>
            <ListGroup variant={"flush"}>
                <ListGroup.Item><Link
                    to={`/manage/patients/${props.patientId}/bloods/bl12folate`}>{t("view-bloods-bl12-folate")}</Link><UpdateIcon
                    onClick={() => {
                        setShowModal(true);
                    }}/></ListGroup.Item>
            </ListGroup>
        </div>

    )

}

export interface IBL12FolateProps {
    clientId: number;
    patientId: number;
}
