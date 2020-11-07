import React, {useState} from "react";
import {emptyPhysicalExamResults, PhysicalExamResultsApi} from "../../../api/v1/PhysicalExamResultsApi";
import {useTranslation} from "react-i18next";
import {CreateOrUpdateModal} from "../../../components/CreateOrUpdateModal";
import {Form, FormCheck, FormGroup, FormLabel} from "react-bootstrap";
import If, {Else, Then} from "../../../components/If";
import AutoSuggest from "react-autosuggest";
import {
    emptyPhysicalExamRegion,
    PhysicalExamRegion,
    PhysicalExamRegionApi
} from "../../../api/v1/PhysicalExamRegionApi";


export default function CreateOrUpdatePhysicalExamResults(props: ICreateOrUpdatePhysicalExamResultProps) {
    const [examResult, setExamResult] = useState(emptyPhysicalExamResults());
    const [error, setError] = useState("");
    const [suggestions, setSuggestions] = useState<PhysicalExamRegion[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selected, setSelected] = useState(emptyPhysicalExamRegion());

    const {t} = useTranslation();

    // https://github.com/moroshko/react-autosuggest#installation
    async function getSuggestion(value): Promise<PhysicalExamRegion[]> {
        const searchTerm = value.trim();

        let examregionlist = await PhysicalExamRegionApi.find();

        if (examregionlist.length === 0) {
            return Promise.resolve([emptyPhysicalExamRegion()]);
        }

        const regex = new RegExp(searchTerm, 'i');

        return examregionlist.filter(examRegion => regex.test(getSuggestionValue(examRegion)));

    }

    const inputProps = {
        placeholder:  t("enter-region-name"),
        onChange: (event, {newValue}) => setSearchTerm(newValue),
        value: searchTerm,
        className: "form-control"
    };

    function submit() {
        setError("");
        if (error === "") {
            if (props.id) {
                PhysicalExamResultsApi.update(props.clientId, props.patientId, props.id, examResult)
                    .then(() => {
                        props.success();
                    });
            } else {
                PhysicalExamResultsApi.create(props.clientId, props.patientId, examResult)
                    .then(() => {
                        props.success();
                    });
            }
        }
    }
    if (examResult.id === 0) {
        if (props.id) {
            PhysicalExamResultsApi.findById(props.clientId, props.patientId, props.id)
                .then(data => {
                    setExamResult(data);
                });
        }
    }
    const updateField = e => {
        setExamResult({
            ...examResult,
            [e.target.name]: e.target.value
        });
    };

    const updateAppropriate = e => {
        setExamResult({
            ...examResult,
            appropriate: e.target.checked
        });
    };

    function getSuggestionValue(suggestion) {
        return suggestion.name;
    }

    return (
        <CreateOrUpdateModal title={props.id ? t("update-exam-result") : t("create-exam-result")}
                             confirmText={props.id ? t("update") : t("create")} hide={props.hide}
                             confirm={submit}>
            <Form>
                <If conditional={!props.id}>
                    <Then>
                        <FormGroup controlId="formGridState">
                            <Form.Label>{t("region")}</Form.Label>
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
                                    examResult.regionId=suggestion.id;
                                }}
                                inputProps={inputProps}
                            />
                        </FormGroup>
                    </Then>
                </If>
                <FormGroup>
                    <FormLabel>{t("result")}</FormLabel>
                    <input name="result" type="string" className="form-control" value={examResult.result} onChange={updateField}/>
                </FormGroup>
                <FormGroup>
                    <FormCheck value="true" checked={examResult.appropriate} onChange={updateAppropriate} type="checkbox"
                               label={t("appropriate")}/>
                </FormGroup>
            </Form>
        </CreateOrUpdateModal>
    );
}

export interface ICreateOrUpdatePhysicalExamResultProps {
    id? : number | null;
    clientId: number;
    patientId: number;
    success(): void;
    hide(): void;
}
