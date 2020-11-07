import React, {useState} from "react";
import {Form, FormCheck, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {CreateOrUpdateModal} from "components/CreateOrUpdateModal";
import {ClientApi, emptyClient} from "api/v1/ClientApi";
import {useTranslation} from "react-i18next";

export function CreateOrUpdateClient(props: ICreateOrUpdateClientProps) {
    const [client, setClient] = useState(emptyClient());
    const {t} = useTranslation();

    function submit() {
        if (props.clientId) {
            ClientApi.update(props.clientId, client)
                .then(() => {
                    props.success();
                });
        } else {
            ClientApi.create(client)
                .then(() => {
                    props.success();
                });
        }
    }

    if (client.id === 0) {
        if (props.clientId) {
            ClientApi.findById(props.clientId)
                .then(data => {
                    setClient(data);
                });
        }
    }

    const updateField = e => {
        setClient({
            ...client,
            [e.target.name]: e.target.value
        });
    };

    const updateDisabled = e => {
        setClient({
            ...client,
            disabled: e.target.checked
        });
    };

    return (
        <CreateOrUpdateModal title={props.clientId ? t("update-client") : t("create-client")}
                             confirmText={props.clientId ? t("update") : t("create")} hide={props.hide} confirm={submit}>
            <Form>
                <FormGroup>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl name="name" value={client.name} onChange={updateField} type="text"/>
                </FormGroup>
                <FormGroup>
                    <FormCheck value="true" defaultChecked={client.disabled} onChange={updateDisabled} type="checkbox" label={t("disabled")} />
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("subdomain")}</FormLabel>
                    <FormControl name="subdomain" value={client.subdomain} onChange={updateField} type="text"/>
                </FormGroup>
            </Form>
        </CreateOrUpdateModal>
    );
}

export interface ICreateOrUpdateClientProps {
    clientId?: number | null;
    success(): void;
    hide(): void;
}