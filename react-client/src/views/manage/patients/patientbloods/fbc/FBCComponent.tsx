import React, {useState} from "react";
import {ListGroup} from "react-bootstrap";
import {UpdateIcon} from "../../../../../components/CrudIcons";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import CreateOrUpdateFBC from "./CreateOrUpdateFBC";
import If from "../../../../../components/If";

export default function FBCComponent(props: IFBCProps) {
    const [showModal, setShowModal] = useState(false);

    const {t} = useTranslation();


    return (
        <div>
            <If conditional={showModal}>
                <CreateOrUpdateFBC clientId={props.clientId} patientId={props.patientId}
                                            hide={() => setShowModal(false)} success={() => {
                    setShowModal(false);
                }}/>
            </If>
                        <ListGroup variant={"flush"}>
                            <ListGroup.Item><Link
                                to={`/manage/patients/${props.patientId}/bloods/fbc`}>{t("view-bloods-fbc")}</Link><UpdateIcon
                                onClick={() => {
                                    setShowModal(true);
                                }}/></ListGroup.Item>
                        </ListGroup>
        </div>

    )

}

export interface IFBCProps {
    clientId: number;
    patientId: number;
}
