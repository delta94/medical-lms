import React, {useState} from "react";
import {ListGroup} from "react-bootstrap";
import {UpdateIcon} from "../../../../../components/CrudIcons";
import {Link} from "react-router-dom";
import If from "../../../../../components/If";
import CreateOrUpdateTFTS from "./CreateOrUpdateTFTS";
import {useTranslation} from "react-i18next";

export default function TFTSComponent(props: ITFTSProps) {
    const [showModal, setShowModal] = useState(false);

    const {t} = useTranslation();

    return (
        <div>
            <If conditional={showModal}>
                <CreateOrUpdateTFTS clientId={props.clientId} patientId={props.patientId}
                                     hide={() => setShowModal(false)} success={() => {
                    setShowModal(false);
                }}/>
            </If>
            <ListGroup variant={"flush"}>
                <ListGroup.Item><Link
                    to={`/manage/patients/${props.patientId}/bloods/tfts`}>{t("view-bloods-tfts")}</Link><UpdateIcon
                    onClick={() => {
                        setShowModal(true);
                    }}/></ListGroup.Item>
            </ListGroup>
        </div>

    )

}

export interface ITFTSProps {
    clientId: number;
    patientId: number;
}
