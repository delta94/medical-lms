import {TextNode} from "../../case-logic/graph-nodes/TextNode";
import {Button} from "react-bootstrap";
import React, {useState} from "react";
import SceneTextbox from "./SharedComponents";
import {INodeProps} from "../../case-logic/graph-nodes/GraphNode";
import {useTranslation} from "react-i18next";
import {emptyScenarioSpeaker, ScenarioSpeakerApi} from "../../api/v1/ScenarioSpeakerApi";
import Image from "react-bootstrap/Image";
import If from "../If";

export default function TextComponent(props: INodeProps) {
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState(emptyScenarioSpeaker());

    const {t} = useTranslation();

    let step: number = Number(props.state.step);
    if (isNaN(step)) step = 0;

    let text: string = (props.state.node as TextNode).texts[step].text;
    let speaker: string = (props.state.node as TextNode).texts[step].speaker || " ";
    let speakerId: number = (props.state.node as TextNode).texts[step].speakerId || 0;

    if (!loaded) {
        ScenarioSpeakerApi.findById(props.state.clientId, props.state.scenarioId, speakerId)
            .then(data => {
                setData(data);
            });
        setLoaded(true);
    }

    text = props.state.flags.replaceFlagsWithValues(text);
    speaker = props.state.flags.replaceFlagsWithValues(speaker);

    return (
        <div>
            <If conditional={data.avatar}>
            <Image style={{objectFit: "cover", width: 100, height: 100}} src={data.avatar} roundedCircle alt="Avatar" />
            </If>
            <SceneTextbox text={speaker.trim() !== "" ?  `${speaker}: ${text}` : `${text}`}/>
            <Button onClick={() => {
                props.progress(0);
                setLoaded(false);
            }}>{t("next")}</Button>
        </div>
    );
}
