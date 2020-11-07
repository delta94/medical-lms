import React, {useState} from "react";
import {Alert, Form, FormControl, FormGroup, FormLabel, InputGroup} from "react-bootstrap";
import {CreateOrUpdateModal} from "../../../components/CreateOrUpdateModal";
import {useTranslation} from "react-i18next";
import If from "../../../components/If";
import {emptyPatient, PatientApi} from "../../../api/v1/PatientApi";

export default function CreateOrUpdatePatient(props: ICreateOrUpdatePatientProps) {
    const [patient, setPatient] = useState(emptyPatient());
    const [error, setError] = useState("");


    const {t} = useTranslation();

    async function submit() {

        setError("");

        if (patient.name === "" || patient.age === 0 || patient.description === "" || patient.height === 0 || patient.weight === 0 || patient.ethnicity === "") {
            setError("All fields are required");
        }

        if (error === "") {
            if (props.patientId) {
                PatientApi.update(props.clientId, props.patientId, patient)
                    .then(() => {
                        props.success();
                    });
            } else {
                PatientApi.create(props.clientId, patient)
                    .then(() => {
                        props.success();
                    });
            }
        }
    }

    if (patient.id === 0) {
        if (props.patientId) {
            PatientApi.findById(props.clientId, props.patientId)
                .then(data => {
                    setPatient(data);
                });

        }
    }

    const updateIsFemale = e => {
        setPatient({
            ...patient,
            isFemale: e.target.checked
        });
    };

    const updateField = e => {
        setPatient({
            ...patient,
            [e.target.name]: e.target.value
        });
    };

    const updateNumberField = e => {
        setPatient({
            ...patient,
            [e.target.name]: +e.target.value
        });
    };
    return (
        <CreateOrUpdateModal title={props.patientId ? t("update-patient") : t("create-patient")}
                             confirmText={props.patientId ? t("update") : t("create")} hide={props.hide}
                             confirm={submit}>
            <Form>
                <FormGroup>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl name="name" type="text" defaultValue={patient.name} onChange={updateField}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("description")}</FormLabel>
                    <FormControl name="description" type="text" defaultValue={patient.description}
                                 onChange={updateField}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("ethnicity")}</FormLabel>
                    <FormControl name="ethnicity" type="text" defaultValue={patient.ethnicity}
                                 onChange={updateField}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("age")}</FormLabel>
                    <input name="age" type="number" className="form-control" value={patient.age}
                           onChange={updateNumberField}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("sex")}</FormLabel>
                    <Form.Check
                        value="true"
                        checked={patient.isFemale}
                        onChange={updateIsFemale}
                        className="unselectable"
                        disabled={false}
                        type="switch"
                        id="gender"
                        label={patient.isFemale ? t("female") : t("male")}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("height")}</FormLabel>
                    <InputGroup>
                        <input name="height" type="number" className="form-control" value={patient.height}
                               onChange={updateNumberField}/>
                        <InputGroup.Append>
                            <InputGroup.Text>M</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("weight")}</FormLabel>
                    <InputGroup>
                        <input name="weight" type="number" className="form-control" value={patient.weight}
                               onChange={updateNumberField}/>
                        <InputGroup.Append>
                            <InputGroup.Text>Kg</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
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

export interface ICreateOrUpdatePatientProps {
    clientId: number;
    patientId?: number | null;

    success(): void;

    hide(): void;
}
