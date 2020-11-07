import React from "react";
import Icon from "./Icon";
import {useTranslation} from "react-i18next";

export function UpdateIcon(props) {
    const {t} = useTranslation();

    return (
        <Icon href="#" disabled={props.disabled} onClick={props.onClick} title={t("update")}>edit</Icon>
    );
}
export function DeleteIcon(props) {
    const {t} = useTranslation();

    return (
        <Icon href="#" disabled={props.disabled} onClick={props.onClick} title={t("delete")}>delete</Icon>
    );
}