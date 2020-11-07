import React, {useState} from "react";
import {INodeProps} from "../../case-logic/graph-nodes/GraphNode";
import {useTranslation} from "react-i18next";
import {Button} from "react-bootstrap";
import {ClerkingInfoApi} from "../../api/v1/ClerkingInfoApi";
import SceneTextbox, {KeyValuePair} from "./SharedComponents";


export default function ClerkingInfoComponent(props: INodeProps) {
    const {t} = useTranslation();

    const [clerkingArray, setClerkingArray] = useState(new Array<KeyValuePair<string, string>>());
    const [clerkingInfoLoaded, setClerkingInfoLoaded] = useState(false);
    const [loaded, setLoaded] = useState(false);

    if(!loaded && props.state.clientId){
        setLoaded(true);
        ClerkingInfoApi.find(props.state.clientId, props.state.patients[0].id)
            .then((clerkingInfo) => {
                setClerkingInfoLoaded(true);
                setClerkingArray([
                    {key: t("adl"), value: clerkingInfo.adl},
                    {key: t("alcohol-consumption-(units)"), value: clerkingInfo.alcoholConsumption.toString()},
                    {key: t("allergies"), value: clerkingInfo.allergies},
                    {key: t("current-complaint-history"), value: clerkingInfo.currentComplaintHistory},
                    {key: t("drug-history"), value: clerkingInfo.drugHistory},
                    {key: t("family-history"), value: clerkingInfo.familyHistory},
                    {key: t("medical-history"), value: clerkingInfo.medicalHistory},
                    {key: t("smoking-status"), value: clerkingInfo.smokingStatus ? t("yes") : t("no")}
                ]);
        });
    }

    if(clerkingInfoLoaded){
        if(props.state.step){
            let pair: KeyValuePair<string, string> = props.state.step;
            return (
                <div>
                    <SceneTextbox text={`${pair.key}: ${pair.value}`}/>
                    <Button onClick={() => props.progress(0)}>{t("next")}</Button>
                </div>
            );
        }else{
            return (
                <div>
                    <SceneTextbox text={t("choose-option")}/>

                    {clerkingArray.map((pair, index) => {
                        return (<Button
                            key={pair.key}
                            onClick={() => props.progress(pair)}>
                            {props.state.flags.replaceFlagsWithValues(pair.key)}
                        </Button>)
                    })}
                    <Button key={0} onClick={() => props.progress("next")}>
                        {t("next")}
                    </Button>
                </div>
            );
        }
    }else{
        return(
            <div>
                ${`${t("loading")}...`}
            </div>
        );
    }
}