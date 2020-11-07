import React from "react";
import Icon from "./Icon";

export function Check(props: ICheckProps) {
    return props.value ? <Icon>check</Icon> : <Icon>close</Icon>;
}

export interface ICheckProps {
    value: boolean;
}