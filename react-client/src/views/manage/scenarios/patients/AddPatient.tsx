import React, {useState} from "react";
import ModalHeader from "react-bootstrap/ModalHeader";
import {Button, Modal, ModalBody, ModalFooter, ModalTitle} from "react-bootstrap";
import AutoSuggest from "react-autosuggest";
import If, {Else, Then} from "../../../../components/If";
import {IQueryRequest, QueryRequest} from "../../../../api/QueryRequest";
import {useTranslation} from "react-i18next";
import {emptyPatient, Patient, PatientApi} from "../../../../api/v1/PatientApi";
import {ScenarioApi} from "../../../../api/v1/ScenarioApi";

export default function AddPatient(props: IAddPatientProps) {
    const [suggestions, setSuggestions] = useState<Patient[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selected, setSelected] = useState(emptyPatient());
    const [query] = useState<IQueryRequest>(new QueryRequest());
    const {t} = useTranslation();

    async function getSuggestion(value): Promise<Patient[]> {
        query.searchTerm = value.trim();

        let patients = await PatientApi.find(props.clientId, query);

        if (patients.list.length === 0) {
            return Promise.resolve([emptyPatient()]);
        } else {
            return patients.list;
        }
    }

    function getSuggestionValue(suggestion) {
        return suggestion.name;
    }

    const inputProps = {
        placeholder: t("enter-patient-name"),
        onChange: (event, {newValue}) => setSearchTerm(newValue),
        value: searchTerm,
        className: "form-control"
    };

    function submit(): void {
        ScenarioApi.addPatient(props.clientId, props.scenarioId, selected.id)
            .then(_ => {
                props.confirm();
            });
    }

    return (
        <Modal show={true} centered={true} onHide={props.hide}>
            <ModalHeader closeButton>
                <ModalTitle>{t("add-patient")}</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <If conditional={selected.id !== 0}>
                    <div>Selected: {selected.name}</div>
                </If>

                <AutoSuggest
                    suggestions={suggestions}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={(suggestion) => {
                        return (
                            <If conditional={suggestion.id === 0} hasElse={true}>
                                <Then>
                                    <div>{t("no-results")}</div>
                                </Then>
                                <Else>
                                    <div>{suggestion.name}</div>
                                </Else>
                            </If>
                        )
                    }}
                    onSuggestionsFetchRequested={({value}) => {
                        getSuggestion(value).then(data => setSuggestions(data));
                    }}
                    onSuggestionsClearRequested={() => {
                        setSuggestions([]);
                    }}
                    onSuggestionSelected={(event, {suggestion}) => {
                        setSelected(suggestion);
                    }}
                    inputProps={inputProps}
                />
            </ModalBody>
            <ModalFooter>
                <Button variant="secondary" onClick={props.hide}>{t("cancel")}</Button>
                <Button variant="primary" onClick={submit} disabled={selected.id === 0}>{t("add")}</Button>
            </ModalFooter>
        </Modal>
    );
}

export interface IAddPatientProps {
    clientId: number;
    scenarioId: number;
    hide(): void;
    confirm(): void;
}