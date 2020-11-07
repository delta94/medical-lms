import {useGlobalState} from "../state/GlobalState";
import React from "react";
import If from "./If";

export function IfFeature(props: IIfFeatureProps) {
    const [globalState] = useGlobalState();
    let condition = globalState.features?.includes(props.feature.toLowerCase()) ?? false;
    return (
        <If conditional={condition} hasElse={props.hasElse ?? false}>
            {props.children}
        </If>
    );
}

export interface IIfFeatureProps {
    feature: string;
    hasElse?: boolean;
    children: any;
}