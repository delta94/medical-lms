import React, {useState} from "react";
import {Button, Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import If, {Else, Then} from "../If";
import {Guid} from "guid-typescript";
import {useTranslation} from "react-i18next";
import {stopPropagation} from "../../views/manage/scenarios/graph/ManageGraph";
import {INode} from "@mrblenny/react-flow-chart/src";
import {emptyScenarioSpeaker, ScenarioSpeaker, ScenarioSpeakerApi} from "../../api/v1/ScenarioSpeakerApi";
import {IQueryRequest, QueryRequest} from "../../api/QueryRequest";
import {useGlobalState} from "../../state/GlobalState";
import AutoSuggest from "react-autosuggest";


export function TextNodeInner(node: INode): JSX.Element {
    const {t} = useTranslation();
    const [suggestions, setSuggestions] = useState<ScenarioSpeaker[]>([]);

    const [globalState] = useGlobalState();

    if (node.properties.texts === undefined) {
        node.properties.texts = [
            {guid: Guid.create().toString(), text: "", speaker: "", speakerId: 0}
        ]
    }

    async function getSuggestion(value): Promise<ScenarioSpeaker[]> {
        let query: IQueryRequest = new QueryRequest();
        query.searchTerm = value.trim();

        let scenarioSpeakers = await ScenarioSpeakerApi.find(globalState.user.clientId, node.properties.scenarioId, query);

        if (scenarioSpeakers.list.length === 0) {
            return Promise.resolve([emptyScenarioSpeaker()]);
        } else {
            return scenarioSpeakers.list;
        }
    }

    function getSuggestionValue(suggestion) {
        return suggestion.name;
    }


    const textEntry = (value, index: number, onChange) => {
        const inputProps = {
            placeholder: t("enter-speaker"),
            onChange: (event, {newValue}) => value.searchTerm = newValue,
            value: value.searchTerm ?? "",
            className: "form-control",
            onClick: stopPropagation,
            onMouseUp: stopPropagation,
            onMouseDown: stopPropagation,
            onKeyDown: stopPropagation
        };
        return (
            <div>
                <FormGroup controlId="formGridState">
                    <Form.Label>{t("speaker")}</Form.Label>
                    <If conditional={value.speakerId !== 0}>
                        <div>Selected: {value.speaker}</div>
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
                            value.speaker = suggestion.name;
                            value.speakerId = suggestion.id;
                        }}
                        inputProps={inputProps}
                    />

                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("text")}*</FormLabel>
                    <FormControl name="text" type="text" defaultValue={value.text}
                                 onChange={onChange}
                                 onClick={stopPropagation}
                                 onMouseUp={stopPropagation}
                                 onMouseDown={stopPropagation}
                                 onKeyDown={stopPropagation}/>
                </FormGroup>
            </div>)
    }

    return (
        <div className="node-inner">
            <Form>
                <h5>{t("dialogue-node")}</h5>
                {node.properties.texts.map((value: any, index) => {
                    return (
                        <div key={value.guid}>
                            {index > 0 && <hr/>}
                            {textEntry(value, index, (e) => {
                                e.stopPropagation();
                                value[e.target.name] = e.target.value;
                            })}

                            <If conditional={index !== 0}>
                                <Button onClick={() => {
                                    const texts = node.properties.texts;
                                    texts.splice(index, 1);
                                }}>{t("remove")}</Button>
                            </If>
                        </div>
                    )
                })}
                <hr/>
                <Button onClick={() => {
                    const texts = node.properties.texts;
                    texts.push({guid: Guid.create().toString(), speaker: "", text: "", speakerId: 0});
                }}>{t("add")}</Button>
            </Form>
        </div>
    );
}
