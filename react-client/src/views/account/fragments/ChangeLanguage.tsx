import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Form, FormControl, FormGroup} from "react-bootstrap";
import {AccountApi} from "api/v1/AccountApi";

export function ChangeLanguage() {
    const [selectedLang, setSelectedLang] = useState("en-GB");
    const [loaded, setLoaded] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        let language = window.localStorage.getItem("i18nextLng");
        if (language) {
            setSelectedLang(language);
            setLoaded(true);
        }
    }

    if (!loaded)
        refresh();

    function submit() {
        AccountApi.setLanguage(selectedLang)
            .then(_ => {
                window.localStorage.setItem("i18nextLng", selectedLang);
                refresh();
                window.location.reload();
            });
    }

    return (
        <div>
            <h2>{t("language")}</h2>
            <Form>
                <FormGroup>
                    <FormControl className="w-35" value={selectedLang} onChange={e => setSelectedLang((e.target as any).value)} as="select">
                        <option value="en-GB">English</option>
                        <option value="cy">Cymraeg</option>
                    </FormControl>
                </FormGroup>
                <Button variant="primary" onClick={submit}>{t("update")}</Button>
            </Form>
        </div>
    );
}