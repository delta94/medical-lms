import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {CreateOrUpdateModal} from "../../../../../components/CreateOrUpdateModal";
import {Form, FormGroup, FormLabel, InputGroup} from "react-bootstrap";
import {BloodsOtherApi, emptyOther} from "../../../../../api/v1/bloods/BloodsOtherApi";

export default function CreateOrUpdateOther(props: ICreateOrUpdateOtherProps) {
    const [Other, setOther] = useState(emptyOther());
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        BloodsOtherApi.find(props.clientId, props.patientId)
            .then(data => {
                setOther(data);
                setLoaded(true);
            });
    }

    function submit() {
        setError("");

        if (error === "") {
            BloodsOtherApi.update(props.clientId, props.patientId, Other)
                .then(response => {
                    if (response.success) {
                        props.success();
                    }
                });
        }
    }

    if (Other.patientId === 0) {
        if (props.patientId) {
            BloodsOtherApi.find(props.clientId, props.patientId)
                .then(data => {
                    setOther(data);
                });
        }
    }

    const updateNumberField = e => {
        setOther(
            {
                ...Other,
                [e.target.name]: +e.target.value
            });
    };


    if (props.clientId !== 0 && !loaded) {
        refresh();
    }

    return (
        <CreateOrUpdateModal title={t("edit-bloods-other")}
                             confirmText={t("save")} hide={props.hide}
                             confirm={submit}>
            <Form>
                <FormGroup>
                    <FormLabel>{t("magnesium")}</FormLabel>
                    <InputGroup>
                        <input name="magnesium" type="number" className="form-control" value={Other.magnesium} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("amylase")}</FormLabel>
                    <InputGroup>
                        <input name="amylase" type="number" className="form-control" value={Other.amylase} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("crp")}</FormLabel>
                    <InputGroup>
                        <input name="crp" type="number" className="form-control" value={Other.crp} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("haemtinics-ferritin")}</FormLabel>
                    <InputGroup>
                        <input name="haematinicsFerritin" type="number" className="form-control" value={Other.haematinicsFerritin} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("troponin-i")}</FormLabel>
                    <InputGroup>
                        <input name="troponinI" type="number" className="form-control" value={Other.troponinI} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("hba1c")}</FormLabel>
                    <InputGroup>
                        <input name="hba1c" type="number" className="form-control" value={Other.hba1c} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("lactate")}</FormLabel>
                    <InputGroup>
                        <input name="lactate" type="number" className="form-control" value={Other.lactate} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
            </Form>
        </CreateOrUpdateModal>
    );
}

export interface ICreateOrUpdateOtherProps {
    clientId: number;
    patientId: number;

    success(): void;

    hide(): void;
}
