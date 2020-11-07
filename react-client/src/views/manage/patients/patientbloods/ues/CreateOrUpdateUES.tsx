import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {CreateOrUpdateModal} from "../../../../../components/CreateOrUpdateModal";
import {Form, FormGroup, FormLabel, InputGroup} from "react-bootstrap";
import {BloodsUESApi, emptyUES} from "../../../../../api/v1/bloods/BloodsUESApi";

export default function CreateOrUpdateUES(props: ICreateOrUpdateUESProps) {
    const [Ues, setUes] = useState(emptyUES());
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        BloodsUESApi.find(props.clientId,props.patientId)
            .then(data => {
                setUes(data);
                setLoaded(true);
            });
    }

    function submit() {
        setError("");

        if (error === "") {
            BloodsUESApi.update(props.clientId, props.patientId, Ues)
                .then(response => {
                    refresh();
                    if (response.success) {
                        props.success();
                    }
                });
        }
    }

    if (Ues.patientId === 0) {
        if (props.patientId) {
            BloodsUESApi.find(props.clientId, props.patientId)
                .then(data => {
                    setUes(data);
                });
        }
    }

    const updateNumberField = e => {
        setUes({
            ...Ues,
            [e.target.name]: +e.target.value
        });
    };


    if (props.clientId !== 0 && !loaded) {
        refresh();
    }

    return (
        <CreateOrUpdateModal title={t("edit-bloods-ues")}
                             confirmText={t("save")} hide={props.hide}
                             confirm={submit}>
            <Form>
                <FormGroup>
                    <FormLabel>{t("sodium")}</FormLabel>
                        <InputGroup>
                        <input name="sodium"  type="number" className="form-control" value={Ues.sodium} onChange={updateNumberField}/>
                        </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("potassium")}</FormLabel>
                    <InputGroup>
                        <input name="potassium" type="number" className="form-control" value={Ues.potassium} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("urea")}</FormLabel>
                    <InputGroup>
                        <input name="urea" type="number" className="form-control" value={Ues.urea} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("creatinine")}</FormLabel>
                    <InputGroup>
                        <input name="creatinine" type="number" className="form-control" value={Ues.creatinine} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("eGFR")}</FormLabel>
                    <InputGroup>
						<input name="eGFR" type="number" className="form-control" value={Ues.egfr} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
            </Form>
        </CreateOrUpdateModal>
    );
}

export interface ICreateOrUpdateUESProps {
    clientId: number;
    patientId: number;
    success(): void;

    hide(): void;
}
