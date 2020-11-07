import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {CreateOrUpdateModal} from "../../../components/CreateOrUpdateModal";
import {Form, FormGroup, FormLabel} from "react-bootstrap";
import {ArterialBloodGasApi, emptyArterialBloodGas} from "../../../api/v1/ArterialBloodGasApi";

export default function CreateOrUpdateArterialBloodGas(props: ICreateOrUpdateArterialBloodGasProps) {
    const [arterialBloodGas, setArterialBloodGas] = useState(emptyArterialBloodGas());
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);

    const {t} = useTranslation();

    function submit() {
        setError("");

        if (error === "") {
            ArterialBloodGasApi.update(props.clientId, props.patientId, arterialBloodGas)
                .then(response => {
                    if (response.success) {
                        props.success();
                    }
                });
        }
    }

    if (props.clientId !== 0 && props.patientId !== 0 && props.updating && !loaded) {
        setLoaded(true);
        ArterialBloodGasApi.find(props.clientId,props.patientId)
            .then(data => {
                setArterialBloodGas(data);
            });
    }

    const updateNumberField = e => {
        setArterialBloodGas({
            ...arterialBloodGas,
            [e.target.name]: +e.target.value
        });
    };

    return (
        <CreateOrUpdateModal title={t("edit-abg")}
                             confirmText={t("save")} hide={props.hide}
                             confirm={submit}>
            <Form>
                <FormGroup>
                    <FormLabel>pH</FormLabel>
                        <input name="ph" type="number" className="form-control" value={arterialBloodGas.ph} onChange={updateNumberField}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>PaO<sub>2</sub></FormLabel>
                        <input name="pao2" type="number" className="form-control" value={arterialBloodGas.pao2} onChange={updateNumberField}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>PaCO<sub>2</sub></FormLabel>
                        <input name="paco2" type="number" className="form-control" value={arterialBloodGas.paco2} onChange={updateNumberField}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>HCO<sub>3</sub></FormLabel>
                        <input name="hco3" type="number" className="form-control" value={arterialBloodGas.hco3} onChange={updateNumberField}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("base-excess")}</FormLabel>
                        <input name="baseExcess" type="number" className="form-control" value={arterialBloodGas.baseExcess} onChange={updateNumberField}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("lactate")}</FormLabel>
                        <input name="lactate" type="number" className="form-control" value={arterialBloodGas.lactate} onChange={updateNumberField}/>
                </FormGroup>
            </Form>
        </CreateOrUpdateModal>
    );
}

export interface ICreateOrUpdateArterialBloodGasProps {
    clientId: number;
    patientId: number;
    updating: boolean;
    success(): void;
    hide(): void;
}
