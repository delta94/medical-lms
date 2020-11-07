import React, {useState} from "react";
import {Alert, Form, FormCheck, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {CreateOrUpdateModal} from "../../../components/CreateOrUpdateModal";
import {useTranslation} from "react-i18next";
import If from "../../../components/If";
import {emptyScenario, ScenarioApi} from "../../../api/v1/ScenarioApi";
import bsCustomFileInput from "bs-custom-file-input";

export default function CreateOrUpdateScenario(props: ICreateOrUpdateScenarioProps) {
    const [scenario, setScenario] = useState(emptyScenario());
    const [error, setError] = useState("");

    const {t} = useTranslation();

    function submit() {
        setError("");

        if (scenario.name.trim() === "" || scenario.description.trim() === "") {
            setError("All fields are required");
        }

        if (error === "") {
            if (props.scenarioId) {
                ScenarioApi.update(props.clientId, props.scenarioId, scenario)
                    .then(() => {
                        props.success();
                    });
            } else {
                ScenarioApi.create(props.clientId, scenario)
                    .then(() => {
                        props.success();
                    });
            }
        }
    }

    if (scenario.id === 0) {
        bsCustomFileInput.init();
        if (props.scenarioId) {
            ScenarioApi.findById(props.clientId, props.scenarioId)
                .then(data => {
                    setScenario(data);
                });
        }
    }

    const updateActive = e => {
        setScenario({
            ...scenario,
            active: e.target.checked
        });
    };

    const updateField = e => {
        setScenario({
            ...scenario,
            [e.target.name]: e.target.value
        });
    };

    //https://github.com/BosNaufal/react-file-base64/blob/master/src/js/components/react-file-base64.js
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        let files = e.target.files;
        if (files && files.length > 0) {
            let file = files[0];
            //If this is changed you must also change it on the server.
            if (["image/png","image/jpg", "image/jpeg", "image/svg", "image/svg+xml"].includes(file.type)) {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    let base64 = reader.result!!;
                    setScenario({
                        ...scenario,
                        coverImage: base64.toString()
                    });
                }
            } else {
                e.target.value = "";
            }
        }
    }

    return (
        <CreateOrUpdateModal title={props.scenarioId ? t("update-scenario") : t("create-scenario")}
                             confirmText={props.scenarioId ? t("update") : t("create")} hide={props.hide}
                             confirm={submit}>
            <Form>
                <FormGroup>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl name="name" type="text" defaultValue={scenario.name} onChange={updateField}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("description")}</FormLabel>
                    <FormControl name="description" type="text" defaultValue={scenario.description}
                                 onChange={updateField}/>
                </FormGroup>
                <FormGroup>
                    <Form.File accept="image/*" label="Select an image file" custom onChange={handleImageUpload}/>
                </FormGroup>
                <FormGroup>
                    <FormCheck value="true" checked={scenario.active} onChange={updateActive} type="checkbox"
                               label={t("active")}/>
                </FormGroup>
            </Form>
            <If conditional={error !== "" && error !== null}>
                <Alert variant="danger">
                    {error}
                </Alert>
            </If>
        </CreateOrUpdateModal>
    );
}

export interface ICreateOrUpdateScenarioProps {
    clientId: number;
    scenarioId?: number | null;

    success(): void;

    hide(): void;
}
