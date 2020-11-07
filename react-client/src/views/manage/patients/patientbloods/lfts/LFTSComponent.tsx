import React, {useState} from "react";
import {ListGroup} from "react-bootstrap";
import {UpdateIcon} from "../../../../../components/CrudIcons";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import If from "../../../../../components/If";
import CreateOrUpdateLFTS from "./CreateOrUpdateLFTS";

export default function LFTSComponent(props: ILFTSProps) {
    const [showModal, setShowModal] = useState(false);

    const {t} = useTranslation();

    return (
        <div>
            <If conditional={showModal}>
                <CreateOrUpdateLFTS clientId={props.clientId} patientId={props.patientId}
                                           hide={() => setShowModal(false)} success={() => {
                    setShowModal(false);
                }}/>
            </If>
            <ListGroup variant={"flush"}>
                <ListGroup.Item><Link
                    to={`/manage/patients/${props.patientId}/bloods/lfts`}>{t("view-bloods-lfts")}</Link><UpdateIcon
                    onClick={() => {
                        setShowModal(true);
                    }}/></ListGroup.Item>
            </ListGroup>
        </div>

    )

}

export interface ILFTSProps {
    clientId: number;
    patientId: number;
}
