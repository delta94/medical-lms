import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {CreateOrUpdateModal} from "../../../components/CreateOrUpdateModal";
import {Form, FormCheck, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {ClerkingInfoApi, emptyClerkingInfo} from "../../../api/v1/ClerkingInfoApi";

export default function CreateOrUpdateClerkingInfo(props: ICreateOrUpdateClerkingProps) {
    const [clerkingInfo, setClerkingInfo] = useState(emptyClerkingInfo());
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);

    const {t} = useTranslation();

    function submit() {
        setError("");

        if (error === "") {
            ClerkingInfoApi.update(props.clientId, props.patientId, clerkingInfo)
                .then(response => {
                    if (response.success) {
                        props.success();
                    }
                });
        }
    }

    const updateField = e => {
        setClerkingInfo({
            ...clerkingInfo,
            [e.target.name]: e.target.value
        });
    };

    const updateNumberField = e => {
        setClerkingInfo({
            ...clerkingInfo,
            [e.target.name]: +e.target.value
        });
    };

    const updateSmoking = e => {
        setClerkingInfo({
            ...clerkingInfo,
            smokingStatus: e.target.checked
        });
    };

    if (props.clientId !== 0 && !loaded && props.updating) {
        ClerkingInfoApi.find(props.clientId, props.patientId)
            .then(data => {
                setLoaded(true);
                setClerkingInfo(data);
            });
    }

    return (
        <CreateOrUpdateModal title={t("create-clerking-info")}
                             confirmText={t("save")} hide={props.hide}
                             confirm={submit}>
            <Form>
                <FormGroup>
                    <FormLabel>{t("current-complaint-history")}</FormLabel>
                    <FormControl name="currentComplaintHistory" as={"textarea"}
                                 defaultValue={clerkingInfo.currentComplaintHistory} onChange={updateField}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("medical-history")}</FormLabel>
                    <FormControl name="medicalHistory" as={"textarea"} defaultValue={clerkingInfo.medicalHistory}
                                 onChange={updateField}/>
                </FormGroup>
                <FormGroup>
                    <FormCheck value="true" defaultChecked={clerkingInfo.smokingStatus} onChange={updateSmoking}
                               type="checkbox"
                               label={t("smoking-status")}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("alcohol-consumption-(units)")}</FormLabel>
                    <FormControl name="alcoholConsumption" type="number" defaultValue={clerkingInfo.alcoholConsumption}
                                 onChange={updateNumberField}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("performance-status")}</FormLabel>
                    <FormControl name="performanceStatus" type="text" defaultValue={clerkingInfo.performanceStatus}
                                 onChange={updateField}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("adl")}</FormLabel>
                    <FormControl name="adl" as={"textarea"} defaultValue={clerkingInfo.adl} onChange={updateField}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("drug-history")}</FormLabel>
                    <FormControl name="drugHistory" as={"textarea"} defaultValue={clerkingInfo.drugHistory}
                                 onChange={updateField}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("allergies")}</FormLabel>
                    <FormControl name="allergies" as={"textarea"} defaultValue={clerkingInfo.allergies}
                                 onChange={updateField}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("family-history")}</FormLabel>
                    <FormControl name="familyHistory" as={"textarea"} defaultValue={clerkingInfo.familyHistory}
                                 onChange={updateField}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("systemic-review")}</FormLabel>
                    <FormControl name="systemicReview" as={"textarea"} defaultValue={clerkingInfo.systemicReview}
                                 onChange={updateField}/>
                </FormGroup>
            </Form>
        </CreateOrUpdateModal>
    );
}

export interface ICreateOrUpdateClerkingProps {
    clientId: number;
    patientId: number;
    updating: boolean;

    success(): void;

    hide(): void;
}
