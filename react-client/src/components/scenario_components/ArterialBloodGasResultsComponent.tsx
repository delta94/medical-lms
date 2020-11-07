import React, {useState} from "react";
import {INodeProps} from "../../case-logic/graph-nodes/GraphNode";
import {Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {KeyValuePair, SceneKeyValueView} from "./SharedComponents";
import {ArterialBloodGasApi, emptyArterialBloodGas} from "../../api/v1/ArterialBloodGasApi";

export default function ArterialBloodGasResultsComponent(props: INodeProps) {
    const [abg, setAbg] = useState(emptyArterialBloodGas());
    const [loaded, setLoaded] = useState(false);

    const {t} = useTranslation();

    if (!loaded) {
        ArterialBloodGasApi.find(props.state.clientId, props.state.patients[0].id)
            .then(data => {
                setAbg(data);
            });

        setLoaded(true);
    }

    let array = new Array<KeyValuePair<string|JSX.Element, string>>();

    array.push({key: "pH", value: abg.ph.toString()});
    array.push({key: <span>PaO<sub>2</sub></span>, value: `${abg.pao2}kPa`});
    array.push({key: <span>PaCO<sub>2</sub></span>, value: `${abg.paco2}kPa`});
    array.push({key: <span>HCO<sub>3</sub></span>, value: `${abg.hco3}mmol/L`});
    array.push({key: t("base-excess"), value: `${abg.baseExcess}mmol/L`});
    array.push({key: t("lactate"), value: `${abg.lactate}mmol/L`});

    return (
        <div>
            {abg.clientId !== 0 &&
                <SceneKeyValueView data={array}/>
            }
            <Button disabled={abg.clientId === 0} onClick={() => props.progress(0)}>{t("next")}</Button>
        </div>
    );
}