import React, {useState} from "react";
import {emptySso, SSOApi} from "../../../api/v1/SSOApi";
import {Button, Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {useTranslation} from "react-i18next";

export default function SSOSettings(props: IManageSsoProps) {
    const [sso, setSso] = useState(emptySso());
    const [loaded, setLoaded] = useState(false);

    function refresh() {
        SSOApi.find(props.clientId)
            .then(data => {
                setSso(data);
                setLoaded(true);
            });
    }

    function submit() {
        SSOApi.update(props.clientId, sso)
            .then(response => {
                refresh();
            });
    }

    const updateField = e => {
        setSso({
            ...sso,
            [e.target.name]: e.target.value
        });
    };

    const {t} = useTranslation();


    if (props.clientId !== 0 && !loaded) {
        refresh();
    }

    return (
        <div>
            <Form>
                <FormGroup>
                    <FormLabel>{t("endpoint")}</FormLabel>
                    <FormControl name="endpoint" defaultValue={sso.endpoint} type={"url"} onChange={updateField}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t("certificate")}</FormLabel>
                    <FormControl name="certificate" defaultValue={sso.certificate} as={"textarea"} rows={10}
                                 onChange={updateField}/>
                </FormGroup>
                <Button onClick={submit}>{t("update")}</Button>
            </Form>
        </div>
    )
}

export interface IManageSsoProps {
    clientId: number;

    success(): void;
}
