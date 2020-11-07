import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {CreateOrUpdateModal} from "../../../../../components/CreateOrUpdateModal";
import {Form, FormGroup, FormLabel, InputGroup} from "react-bootstrap";
import {BloodsFBCApi, emptyFBC} from "../../../../../api/v1/bloods/BloodsFBCApi";

export default function CreateOrUpdateFBC(props: ICreateOrUpdateFBCProps) {
    const [Fbc, setFbc] = useState(emptyFBC());
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        BloodsFBCApi.find(props.clientId,props.patientId)
            .then(data => {
                setFbc(data);
                setLoaded(true);
            });
    }

    function submit() {
        setError("");

        if (error === "") {
            BloodsFBCApi.update(props.clientId, props.patientId, Fbc)
                .then(response => {
                    if (response.success) {
                        props.success();
                    }
                });
        }
    }

    if (Fbc.patientId === 0) {
        if (props.patientId) {
            BloodsFBCApi.find(props.clientId, props.patientId)
                .then(data => {
                    setFbc(data);
                });
        }
    }

    const updateNumberField = e => {
        setFbc({
            ...Fbc,
            [e.target.name]: +e.target.value
        });
    };


    if (props.clientId !== 0 && !loaded) {
        refresh();
    }

    return (
        <CreateOrUpdateModal title={t("edit-bloods-fbc")}
                             confirmText={t("save")} hide={props.hide}
                             confirm={submit}>
            <Form>
                <FormGroup>
                    <FormLabel>{t("hb")}</FormLabel>
                    <InputGroup>
                        <input name="hb" type="number" className="form-control" value={Fbc.hb} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("mcv")}</FormLabel>
                    <InputGroup>
                        <input name="mcv" type="number" className="form-control" value={Fbc.mcv} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("mch")}</FormLabel>
                    <InputGroup>
                        <input name="mch" type="number" className="form-control" value={Fbc.mch} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("totalWCC")}</FormLabel>
                    <InputGroup>
                        <input name="totalWcc" type="number" className="form-control" value={Fbc.totalWcc} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("neutrophils")}</FormLabel>
                    <InputGroup>
                        <input name="neutrophils" type="number" className="form-control" value={Fbc.neutrophils} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("lymphocytes")}</FormLabel>
                    <InputGroup>
                        <input name="lymphocytes" type="number" className="form-control" value={Fbc.lymphocytes} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("monocytes")}</FormLabel>
                    <InputGroup>
                        <input name="monocytes" type="number" className="form-control" value={Fbc.monocytes} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("eosinophils")}</FormLabel>
                    <InputGroup>
                        <input name="eosinophils" type="number" className="form-control" value={Fbc.eosinophils} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("platelets")}</FormLabel>
                    <InputGroup>
                        <input name="platelets" type="number" className="form-control" value={Fbc.platelets} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
            </Form>
        </CreateOrUpdateModal>
    );
}

export interface ICreateOrUpdateFBCProps {
    clientId: number;
    patientId: number;
    success(): void;

    hide(): void;
}
