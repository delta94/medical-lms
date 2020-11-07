import React, {useState} from "react";
import {Form, FormCheck, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {CreateOrUpdateModal} from "components/CreateOrUpdateModal";
import {emptyUser, Role, UserApi} from "api/v1/UserApi";
import {useGlobalState} from "state/GlobalState";
import If from "../../../components/If";
import {useTranslation} from "react-i18next";

export function CreateOrUpdateUser(props: ICreateOrUpdateUserProps) {
    const [globalState] = useGlobalState();
    const [user, setUser] = useState(emptyUser());

    const {t} = useTranslation();

    function submit() {
        if (props.userId) {
            UserApi.update(props.clientId, props.userId, user)
                .then(() => {
                    props.success();
                });
        } else {
            UserApi.create(props.clientId, user)
                .then(() => {
                    props.success();
                });
        }
    }

    if (user.id === 0) {
        if (props.userId) {
            UserApi.findById(props.clientId, props.userId)
                .then(data => {
                    setUser(data);
                });
        }
    }

    const updateField = e => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const updateRole = e => {
        setUser({
            ...user,
            role: +e.target.value
        });
    };

    const updateDisabled = e => {
        setUser({
            ...user,
            disabled: e.target.checked
        });
    };

    return (
        <CreateOrUpdateModal title={props.userId ? t("update-user") : t("create-user")}
                             confirmText={props.userId ? t("update") : t("create")} hide={props.hide} confirm={submit}>
            <Form>
                <FormGroup>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl name="name" value={user.name} onChange={updateField} type="text"/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl name="email" value={user.email} onChange={updateField} type="email"/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("role")}</FormLabel>
                    <FormControl name="role" value={user.role.toString()} onChange={updateRole} as="select">
                        <option value={Role.Standard}>Standard</option>
                        <option value={Role.SuperUser}>Super User</option>
                        <If conditional={globalState.user.role >= Role.Admin}>
                            <option value={Role.Admin}>Admin</option>
                        </If>
                    </FormControl>
                </FormGroup>
                <If conditional={props.userId}>
                    <FormGroup>
                        <FormCheck value="true" checked={user.disabled} onChange={updateDisabled} type="checkbox" label={t("disabled")} />
                    </FormGroup>
                </If>
            </Form>
        </CreateOrUpdateModal>
    );
}

export interface ICreateOrUpdateUserProps {
    clientId: number;
    userId?: number | null;
    success(): void;
    hide(): void;
}