import React, {useState} from "react";
import {Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {CreateOrUpdateModal} from "components/CreateOrUpdateModal";
import {emptyGroup, GroupApi} from "../../../api/v1/GroupApi";
import {useTranslation} from "react-i18next";

export function CreateOrUpdateGroup(props: ICreateOrUpdateGroupProps) {
    const [group, setGroup] = useState(emptyGroup());
    const {t} = useTranslation();

    function submit() {
        if (props.groupId) {
            GroupApi.update(props.clientId, props.groupId, group)
                .then(() => {
                    props.success();
                });
        } else {
            GroupApi.create(props.clientId, group)
                .then(() => {
                    props.success();
                });
        }
    }

    if (group.id === 0) {
        if (props.groupId) {
            GroupApi.findById(props.clientId, props.groupId)
                .then(data => {
                    setGroup(data);
                });
        }
    }

    const updateField = e => {
        setGroup({
            ...group,
            [e.target.name]: e.target.value
        });
    };

    return (
        <CreateOrUpdateModal title={props.groupId ? t("update-group") : t("create-group")}
                             confirmText={props.groupId ? t("update") : t("create")} hide={props.hide} confirm={submit}>
            <Form>
                <FormGroup>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl name="name" value={group.name} onChange={updateField} type="text"/>
                </FormGroup>
            </Form>
        </CreateOrUpdateModal>
    );
}

export interface ICreateOrUpdateGroupProps {
    clientId: number;
    groupId?: number | null;
    success(): void;
    hide(): void;
}