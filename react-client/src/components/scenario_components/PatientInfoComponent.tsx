import React from "react";
import {KeyValuePair, SceneKeyValueView} from "./SharedComponents";
import {INodeProps} from "../../case-logic/graph-nodes/GraphNode";
import {Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {calcBMI} from "../../api/v1/PatientApi";

export default function PatientInfoComponent(props: INodeProps) {
    const {t} = useTranslation();

    let patient = props.state.patients[0];

    let array = new Array<KeyValuePair<string, string>>();

    if(patient){
        array.push({key: t("name"), value: patient.name});
        array.push({key: t("age"), value: patient.age.toString()});
        array.push({key: t("sex"), value: patient.isFemale ? t("female").toString() : t("male").toString()});
        array.push({key: t("description"), value: patient.description});
        array.push({key: t("height"), value: `${patient.height}M`});
        array.push({key: t("weight"), value: `${patient.weight}Kg`});
        array.push({key: "BMI", value: calcBMI(patient)});
    }

    return (
        <div>
            <SceneKeyValueView data={array}/>
            <Button onClick={() => props.progress(0)}>{t("next")}</Button>
        </div>
    );
}