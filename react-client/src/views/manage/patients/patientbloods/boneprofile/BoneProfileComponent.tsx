import React, {useState} from "react";
import {ListGroup} from "react-bootstrap";
import {UpdateIcon} from "../../../../../components/CrudIcons";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import If from "../../../../../components/If";
import CreateOrUpdateBoneProfile from "./CreateOrUpdateBoneProfile";

export default function BoneProfileComponent(props: IBoneProfileProps) {
    const [showModal, setShowModal] = useState(false);

    const {t} = useTranslation();

    return (
        <div>
            <If conditional={showModal}>
                <CreateOrUpdateBoneProfile clientId={props.clientId} patientId={props.patientId}
                                          hide={() => setShowModal(false)} success={() => {
                    setShowModal(false);
                }}/>
            </If>
            <ListGroup variant={"flush"}>
                <ListGroup.Item><Link
                    to={`/manage/patients/${props.patientId}/bloods/boneprofile`}>{t("view-bloods-bone-profile")}</Link><UpdateIcon
                    onClick={() => {
                        setShowModal(true);
                    }}/></ListGroup.Item>
            </ListGroup>
        </div>

    )

}

export interface IBoneProfileProps {
    clientId: number;
    patientId: number;
}
