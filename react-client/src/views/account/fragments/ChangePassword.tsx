import {useTranslation} from "react-i18next";
import {Alert, Button, Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import React, {useState} from "react";
import {AccountApi} from "../../../api/v1/AccountApi";
import If from "../../../components/If";

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const {t} = useTranslation();

    function submit() {
        setError("");
        AccountApi.changePassword(currentPassword, newPassword)
            .then(result => {
                if (result.success) {
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                } else if (result.weakpassword) {
                    setError(t("password-too-weak"));
                } else {
                    setError(t("failed-password-update"));
                }
            });
    }

    function disableButton(): boolean {
        return newPassword.length < 8 || newPassword !== confirmPassword;
    }

    return (
        <div>
            <h2>{t("change-password")}</h2>
            <Form>
                <FormGroup>
                    <FormLabel htmlFor="password">{t("current-password")}</FormLabel>
                    <FormControl value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                                 autoComplete="password" name="password" id="password"  type="password"/>
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor="new-password">{t("new-password")}</FormLabel>
                    <FormControl value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                 autoComplete="new-password" name="new-password" id="new-password" type="password"/>
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor="confirm-new-password">{t("confirm-new-password")}</FormLabel>
                    <FormControl value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                 autoComplete="confirm-new-password" id="confirm-new-password" name="confirm-new-password" type="password"/>
                </FormGroup>
                <If conditional={error}>
                    <Alert variant="danger">
                        {error}
                    </Alert>
                </If>
                <Button disabled={disableButton()} variant="primary" onClick={submit}>{t("update")}</Button>
            </Form>
        </div>
    );
}