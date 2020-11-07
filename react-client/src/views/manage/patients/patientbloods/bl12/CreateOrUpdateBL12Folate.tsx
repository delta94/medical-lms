import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {CreateOrUpdateModal} from "../../../../../components/CreateOrUpdateModal";
import {Form, FormGroup, FormLabel, InputGroup} from "react-bootstrap";
import {BloodsBL12FolateApi, emptyBL12Folate} from "../../../../../api/v1/bloods/BloodsBL12FolateApi";

export default function CreateOrUpdateBL12Folate(props: ICreateOrUpdateBL12FolateProps) {
    const [BL12Folate, setBL12Folate] = useState(emptyBL12Folate());
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        BloodsBL12FolateApi.find(props.clientId,props.patientId)
            .then(data => {
                setBL12Folate(data);
                setLoaded(true);
            });
    }

    function submit() {
        setError("");

        if (error === "") {
            BloodsBL12FolateApi.update(props.clientId, props.patientId, BL12Folate)
                .then(response => {
                    if (response.success) {
                        props.success();
                    }
                });
        }
    }

    if (BL12Folate.patientId === 0) {
        if (props.patientId) {
            BloodsBL12FolateApi.find(props.clientId, props.patientId)
                .then(data => {
                    setBL12Folate(data);
                });
        }
    }

    const updateNumberField = e => {
        setBL12Folate({
            ...BL12Folate,
            [e.target.name]: +e.target.value
        });
    };


    if (props.clientId !== 0 && !loaded) {
        refresh();
    }

    return (
        <CreateOrUpdateModal title={t("edit-bloods-bl12-folate")}
                             confirmText={t("save")} hide={props.hide}
                             confirm={submit}>
            <Form>
                <FormGroup>
                    <FormLabel>{t("vitaminB12")}</FormLabel>
                    <InputGroup>
                        <input name="vitaminB12" type="number" className="form-control" value={BL12Folate.vitaminB12} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("folate")}</FormLabel>
                    <InputGroup>
                        <input name="folate" type="number" className="form-control" value={BL12Folate.folate} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
            </Form>
        </CreateOrUpdateModal>
    );
}

export interface ICreateOrUpdateBL12FolateProps {
    clientId: number;
    patientId: number;
    success(): void;

    hide(): void;
}
