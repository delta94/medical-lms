import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {CreateOrUpdateModal} from "../../../../../components/CreateOrUpdateModal";
import {Form, FormGroup, FormLabel, InputGroup} from "react-bootstrap";
import {BloodsBoneProfileApi, emptyBoneProfile} from "../../../../../api/v1/bloods/BloodsBoneProfileApi";

export default function CreateOrUpdateBoneProfile(props: ICreateOrUpdateBoneProfileProps) {
    const [BoneProfile, setBoneProfile] = useState(emptyBoneProfile());
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        BloodsBoneProfileApi.find(props.clientId,props.patientId)
            .then(data => {
                setBoneProfile(data);
                setLoaded(true);
            });
    }

    function submit() {
        setError("");

        if (error === "") {
            BloodsBoneProfileApi.update(props.clientId, props.patientId, BoneProfile)
                .then(response => {
                    if (response.success) {
                        props.success();
                    }
                });
        }
    }

    if (BoneProfile.patientId === 0) {
        if (props.patientId) {
            BloodsBoneProfileApi.find(props.clientId, props.patientId)
                .then(data => {
                    setBoneProfile(data);
                });
        }
    }

    const updateNumberField = e => {
        setBoneProfile({
            ...BoneProfile,
            [e.target.name]: +e.target.value
        });
    };


    if (props.clientId !== 0 && !loaded) {
        refresh();
    }

    return (
        <CreateOrUpdateModal title={t("edit-bloods-bone-profile")}
                             confirmText={t("save")} hide={props.hide}
                             confirm={submit}>
            <Form>
                <FormGroup>
                    <FormLabel>{t("corrected-calcium")}</FormLabel>
                    <InputGroup>
                        <input name="correctedCalcium" type="number" className="form-control" value={BoneProfile.correctedCalcium} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("alp")}</FormLabel>
                    <InputGroup>
                        <input name="alp" type="number" className="form-control" value={BoneProfile.alp} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("phosphate")}</FormLabel>
                    <InputGroup>
                        <input name="phosphate" type="number" className="form-control" value={BoneProfile.phosphate} onChange={updateNumberField}/>
                    </InputGroup>
                </FormGroup>
            </Form>
        </CreateOrUpdateModal>
    );
}

export interface ICreateOrUpdateBoneProfileProps {
    clientId: number;
    patientId: number;
    success(): void;
    hide(): void;
}
