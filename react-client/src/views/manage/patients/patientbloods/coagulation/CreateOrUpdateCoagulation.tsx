import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {CreateOrUpdateModal} from "../../../../../components/CreateOrUpdateModal";
import {Form, FormGroup, FormLabel, InputGroup} from "react-bootstrap";
import {BloodsCoagulationApi, emptyCoagulation} from "../../../../../api/v1/bloods/BloodsCoagulationApi";

export default function CreateOrUpdateCoagulation(props: ICreateOrUpdateCoagulationProps) {
    const [Coagulation, setCoagulation] = useState(emptyCoagulation());
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        BloodsCoagulationApi.find(props.clientId, props.patientId)
            .then(data => {
                setCoagulation(data);
                setLoaded(true);
            });
    }

    function submit() {
        setError("");

        if (error === "") {
            BloodsCoagulationApi.update(props.clientId, props.patientId, Coagulation)
                .then(response => {
                    if (response.success) {
                        props.success();
                    }
                });
        }
    }

    if (Coagulation.patientId === 0) {
        if (props.patientId) {
            BloodsCoagulationApi.find(props.clientId, props.patientId)
                .then(data => {
                    setCoagulation(data);
                });
        }
    }

    const updateNumberField = e => {
        setCoagulation(
            {
                ...Coagulation,
                [e.target.name]: +e.target.value
            });
    };


    if (props.clientId !== 0 && !loaded) {
        refresh();
    }

    return (
        <CreateOrUpdateModal title={t("edit-bloods-coagulation")}
                             confirmText={t("save")} hide={props.hide}
                             confirm={submit}>
            <Form>
                <FormGroup>
                    <FormLabel>{t("pt")}</FormLabel>
                    <InputGroup>
                        <input name="pt" type="number" className="form-control" value={Coagulation.pt} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("aptt")}</FormLabel>
                    <InputGroup>
                        <input name="aptt" type="number" className="form-control" value={Coagulation.aptt} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("fibrinogen")}</FormLabel>
                    <InputGroup>
                        <input name="fibrinogen" type="number" className="form-control" value={Coagulation.fibrinogen} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
            </Form>
        </CreateOrUpdateModal>
    );
}

export interface ICreateOrUpdateCoagulationProps {
    clientId: number;
    patientId: number;

    success(): void;

    hide(): void;
}
