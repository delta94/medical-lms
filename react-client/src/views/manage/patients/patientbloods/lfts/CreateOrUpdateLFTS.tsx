import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {CreateOrUpdateModal} from "../../../../../components/CreateOrUpdateModal";
import {Form, FormGroup, FormLabel, InputGroup} from "react-bootstrap";
import {BloodsLFTSApi, emptyLFTS} from "../../../../../api/v1/bloods/BloodsLFTSApi";

export default function CreateOrUpdateLFTS(props: ICreateOrUpdateLFTSProps) {
    const [LFTS, setLFTS] = useState(emptyLFTS());
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        BloodsLFTSApi.find(props.clientId, props.patientId)
            .then(data => {
                setLFTS(data);
                setLoaded(true);
            });
    }

    function submit() {
        setError("");

        if (error === "") {
            BloodsLFTSApi.update(props.clientId, props.patientId, LFTS)
                .then(response => {
                    if (response.success) {
                        props.success();
                    }
                });
        }
    }

    if (LFTS.patientId === 0) {
        if (props.patientId) {
            BloodsLFTSApi.find(props.clientId, props.patientId)
                .then(data => {
                    setLFTS(data);
                });
        }
    }

    const updateNumberField = e => {
        setLFTS(
            {
                ...LFTS,
                [e.target.name]: +e.target.value
            });
    };


    if (props.clientId !== 0 && !loaded) {
        refresh();
    }

    return (
        <CreateOrUpdateModal title={t("edit-bloods-lfts")}
                             confirmText={t("save")} hide={props.hide}
                             confirm={submit}>
            <Form>
                <FormGroup>
                    <FormLabel>{t("alp")}</FormLabel>
                    <InputGroup>
                        <input name="alp" type="number" className="form-control" value={LFTS.alp} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("alt")}</FormLabel>
                    <InputGroup>
                        <input name="alt" type="number" className="form-control" value={LFTS.alt} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("bilirubin")}</FormLabel>
                    <InputGroup>
                        <input name="bilirubin" type="number" className="form-control" value={LFTS.bilirubin} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("albumin")}</FormLabel>
                    <InputGroup>
                        <input name="albumin" type="number" className="form-control" value={LFTS.albumin} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
            </Form>
        </CreateOrUpdateModal>
    );
}

export interface ICreateOrUpdateLFTSProps {
    clientId: number;
    patientId: number;

    success(): void;

    hide(): void;
}
