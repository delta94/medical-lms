import React, {useState} from "react";
import {Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {CreateOrUpdateModal} from "../../../components/CreateOrUpdateModal";
import {useTranslation} from "react-i18next";
import {emptyScenarioSpeaker, ScenarioSpeakerApi} from "../../../api/v1/ScenarioSpeakerApi";
import bsCustomFileInput from "bs-custom-file-input";

export default function CreateOrUpdateScenarioSpeaker(props: ICreateOrUpdateScenarioSpeakerProps) {
    const [scenarioSpeaker, setScenarioSpeaker] = useState(emptyScenarioSpeaker());

    const {t} = useTranslation();

    function submit() {
        if (props.id) {
            ScenarioSpeakerApi.update(props.clientId, props.scenarioId, props.id, scenarioSpeaker)
                .then(() => {
                    props.success();
                });
        } else {
            ScenarioSpeakerApi.create(props.clientId, props.scenarioId, scenarioSpeaker)
                .then(() => {
                    props.success();
                });
        }
    }

    if (scenarioSpeaker.id === 0) {
        bsCustomFileInput.init();
        if (props.id) {
            ScenarioSpeakerApi.findById(props.clientId, props.scenarioId, props.id)
                .then(data => {
                    setScenarioSpeaker(data);
                });
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        let files = e.target.files;
        if (files && files.length > 0) {
            let file = files[0];
            //If this is changed you must also change it on the server.
            if (["image/png", "image/jpg", "image/jpeg", "image/svg", "image/svg+xml"].includes(file.type)) {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    let base64 = reader.result!!;
                    setScenarioSpeaker({
                        ...scenarioSpeaker,
                        avatar: base64.toString()
                    });
                }
            } else {
                e.target.value = "";
            }
        }
    }

    const updateField = e => {
        setScenarioSpeaker({
            ...scenarioSpeaker,
            [e.target.name]: e.target.value
        });
    };

    return (
        <CreateOrUpdateModal title={props.id ? t("update-scenario-speaker") : t("create-scenario-speaker")}
                             confirmText={props.id ? t("update") : t("create")} hide={props.hide}
                             confirm={submit}>
            <Form>
                <FormGroup>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl name="name" type="text" defaultValue={scenarioSpeaker.name} onChange={updateField}/>
                </FormGroup>
                <FormGroup>
                    <Form.File accept="image/*" label="Select an image file" custom onChange={handleImageUpload}/>
                </FormGroup>
            </Form>
        </CreateOrUpdateModal>
    );
}

export interface ICreateOrUpdateScenarioSpeakerProps {
    clientId: number;
    scenarioId: number;
    id?: number | null;

    success(): void;

    hide(): void;
}
