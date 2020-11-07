import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import {IQueryRequest, QueryRequest} from "../../api/QueryRequest";
import {emptyEnvironment, Environment, ScenarioEnvironmentApi} from "../../api/v1/ScenarioEnvironmentApi";
import {IChart, INode} from "@mrblenny/react-flow-chart/src";
import If, {Else, Then} from "../If";
import AutoSuggest from "react-autosuggest";

export default function EnvironmentSidebar({clientId, scenarioId, graph, selectedNode, rerender}: IEnvironmentSidebarProps) {
    const [suggestions, setSuggestions] = useState<Environment[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selected, setSelected] = useState(emptyEnvironment());
    const [query] = useState<IQueryRequest>(new QueryRequest());

    const {t} = useTranslation();

    async function getSuggestion(value): Promise<Environment[]> {
        query.searchTerm = value.trim();

        let result = await ScenarioEnvironmentApi.find(clientId, scenarioId, query);

        if (result.list.length === 0) {
            return Promise.resolve([emptyEnvironment()]);
        } else {
            return result.list;
        }
    }

    function getSuggestionValue(suggestion) {
        return suggestion.name;
    }

    const inputProps = {
        placeholder: t("enter-environment-name"),
        onChange: (event, {newValue}) => setSearchTerm(newValue),
        value: searchTerm,
        className: "form-control"
    };

    return (
        <div className="graph-sidebar-contents">
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
                    selectedNode!!.properties.environmentId = suggestion.id;
                }}
                inputProps={inputProps}
            />
        </div>
    );
}

export interface IEnvironmentSidebarProps {
    clientId: number;
    scenarioId: number;
    graph: IChart;
    selectedNode: INode | null | undefined;
    rerender: Function;
}
