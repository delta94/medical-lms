import React, {useState} from "react";
import {Alert, Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {emptyEnvironment, ScenarioEnvironmentApi} from "../../../../api/v1/ScenarioEnvironmentApi";
import If from "../../../../components/If";
import {CreateOrUpdateModal} from "../../../../components/CreateOrUpdateModal";
import Image from "react-bootstrap/Image";

export default function CreateOrUpdateEnvironment(props: ICreateOrUpdateEnvironmentProps) {
    const [environment, setEnvironment] = useState(emptyEnvironment());
    const [error, setError] = useState("");

    const {t} = useTranslation();

    function submit() {
        setError("");

        if (environment.name.trim() === "" || environment.image.trim() === "") {
            setError("All fields are required");
        }

        if (error === "") {
            if (props.environmentId) {
                ScenarioEnvironmentApi.update(props.clientId, props.scenarioId, props.environmentId, environment)
                    .then(data => {
                        props.success();
                    });
            } else {
                ScenarioEnvironmentApi.create(props.clientId, props.scenarioId, environment)
                    .then(data => {
                        props.success();
                    });
            }
        }
    }

    if (environment.id === 0) {
        if (props.environmentId) {
            ScenarioEnvironmentApi.findById(props.clientId, props.scenarioId, props.environmentId)
                .then(environment => {
                    setEnvironment(environment);
                });
        }
    }

    const updateField = e => {
        setEnvironment({
            ...environment,
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
                    setEnvironment({
                        ...environment,
                        image: base64.toString()
                    });
                }
            } else {
                e.target.value = "";
            }
        }
    }

    return (
        <CreateOrUpdateModal title={props.environmentId ? t("update-environment") : t("create-environment")}
                             confirmText={props.environmentId ? t("update") : t("create")} hide={props.hide}
                             confirm={submit}>
            <Form>
                <FormGroup>
                    <FormLabel htmlFor="name">{t("name")}</FormLabel>
                    <FormControl id="name" name="name" type="text" defaultValue={environment.name} onChange={updateField}/>
                </FormGroup>
                <FormGroup>
                    <Form.File accept="image/*" label="Select an image file" custom  onChange={handleImageUpload}/>
                </FormGroup>
                <If conditional={environment.image}>
                    <Image fluid={true} src={environment.image} alt={environment.name} />
                </If>
            </Form>
            <If conditional={error !== "" && error !== null}>
                <Alert variant="danger">
                    {error}
                </Alert>
            </If>
        </CreateOrUpdateModal>
    );
}

export interface ICreateOrUpdateEnvironmentProps {
    clientId: number;
    scenarioId: number;
    environmentId: number | null;

    success(): void;
    hide(): void;
}
