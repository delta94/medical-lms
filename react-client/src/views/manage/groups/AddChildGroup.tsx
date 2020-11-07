import React, {useState} from "react";
import {emptyUser} from "../../../api/v1/UserApi";
import ModalHeader from "react-bootstrap/ModalHeader";
import {Button, Modal, ModalBody, ModalFooter, ModalTitle} from "react-bootstrap";
import AutoSuggest from "react-autosuggest";
import If, {Else, Then} from "../../../components/If";
import {emptyGroup, Group, GroupApi} from "../../../api/v1/GroupApi";
import {IQueryRequest, QueryRequest} from "../../../api/QueryRequest";
import {useTranslation} from "react-i18next";

export default function AddChildGroup(props: IAddChildGroupProps) {
    const [suggestions, setSuggestions] = useState<Group[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selected, setSelected] = useState(emptyUser());
    const [query] = useState<IQueryRequest>(new QueryRequest());
    const {t} = useTranslation();

    async function getSuggestion(value): Promise<Group[]> {
        query.searchTerm = value.trim();

        let groups = await GroupApi.find(props.clientId, query);

        if (groups.list.length === 0) {
            return Promise.resolve([emptyGroup()]);
        } else {
            return groups.list;
        }
    }

    function getSuggestionValue(suggestion) {
        return suggestion.name;
    }

    const inputProps = {
        placeholder: "Enter group name",
        onChange: (event, {newValue}) => setSearchTerm(newValue),
        value: searchTerm,
        className: "form-control"
    };

    function submit(): void {
        GroupApi.addChildGroup(props.clientId, props.groupId, selected.id)
            .then(_ => {
                props.confirm();
            });
    }

    return (
        <Modal show={true} centered={true} onHide={props.hide}>
            <ModalHeader closeButton>
                <ModalTitle>{t("add-child-group")}</ModalTitle>
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

export interface IAddChildGroupProps {
    clientId: number;
    groupId: number;
    hide(): void;
    confirm(): void;
}