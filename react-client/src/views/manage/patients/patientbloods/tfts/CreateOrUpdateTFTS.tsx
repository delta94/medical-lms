import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {CreateOrUpdateModal} from "../../../../../components/CreateOrUpdateModal";
import {Form, FormGroup, FormLabel, InputGroup} from "react-bootstrap";
import {BloodsTFTSApi, emptyTFTS} from "../../../../../api/v1/bloods/BloodsTFTSApi";

export default function CreateOrUpdateTFTS(props: ICreateOrUpdateTFTSProps) {
    const [TFTS, setTFTS] = useState(emptyTFTS());
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        BloodsTFTSApi.find(props.clientId, props.patientId)
            .then(data => {
                setTFTS(data);
                setLoaded(true);
            });
    }

    function submit() {
        setError("");

        if (error === "") {
            BloodsTFTSApi.update(props.clientId, props.patientId, TFTS)
                .then(response => {
                    if (response.success) {
                        props.success();
                    }
                });
        }
    }

    if (TFTS.patientId === 0) {
        if (props.patientId) {
            BloodsTFTSApi.find(props.clientId, props.patientId)
                .then(data => {
                    setTFTS(data);
                });
        }
    }

    const updateNumberField = e => {
        setTFTS(
            {
                ...TFTS,
                [e.target.name]: +e.target.value
            });
    };


    if (props.clientId !== 0 && !loaded) {
        refresh();
    }

    return (
        <CreateOrUpdateModal title={t("edit-bloods-tfts")}
                             confirmText={t("save")} hide={props.hide}
                             confirm={submit}>
            <Form>
                <FormGroup>
                    <FormLabel>{t("tsh")}</FormLabel>
                    <InputGroup>
                        <input name="tsh" type="number" className="form-control" value={TFTS.tsh} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("free-t4")}</FormLabel>
                    <InputGroup>
                        <input name="freeT4" type="number" className="form-control" value={TFTS.freeT4} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("free-t3")}</FormLabel>
                    <InputGroup>
                    <input name="freeT3" type="number" className="form-control" value={TFTS.freeT3} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
            </Form>
        </CreateOrUpdateModal>
    );
}

export interface ICreateOrUpdateTFTSProps {
    clientId: number;
    patientId: number;

    success(): void;

    hide(): void;
}
