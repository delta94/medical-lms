import React, {useState} from 'react'
import {INodeProps, StateInfo} from "../../case-logic/graph-nodes/GraphNode";
import {
    PhysicalExamResults,
    PhysicalExamResultsApi,
    PhysicalExamResultsFind
} from "../../api/v1/PhysicalExamResultsApi";
import {PhysicalExamRegion, PhysicalExamRegionApi} from "../../api/v1/PhysicalExamRegionApi";
import {QueryRequest} from "../../api/QueryRequest";
import SceneTextbox, {SceneHeader} from "./SharedComponents";
import {Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";

export default function ExamResultComponent(props: INodeProps) {

    const [examRegions, setExamRegions] = useState<Map<number, PhysicalExamRegion> | undefined>();
    const [examResults, setExamResults] = useState<Map<number, PhysicalExamResults> | undefined>();
    const [loaded, setLoaded] = useState(false);


    if(!loaded){
        setLoaded(true);
        PhysicalExamRegionApi.find().then((regions) => {
            let map = new Map<number, PhysicalExamRegion>();
            for (let region of regions) {
                map.set(region.id, region);
            }
            setExamRegions(map);
        });

        PhysicalExamResultsApi.find(props.state.clientId, props.state.patients[0].id, new QueryRequest(1, 20)).then((results) => {
            let map = new Map<number, PhysicalExamResultsFind>();
            for (let result of results.list) {
                map.set(result.regionId, result);
            }
            setExamResults(map);
        });
    }

    if(examRegions !== undefined && examResults !== undefined){
        if(props.state.step){
            let result: PhysicalExamResults | undefined = examResults.get(props.state.step as number);
            if(result !== undefined){
                return <ExamResult {...props} result={result} />
            }
        }else{
            return <ExamResultOptions {...props} options={Array.from(examRegions.values())} />
        }
    }
    return (<div></div>);
}

function ExamResultOptions(props: IExamResultOptionsProps) {
    const {t} = useTranslation();

    return (
        <div>
            <SceneTextbox text={t("choose-region")} />

            {props.options.map((region, index) => {
                return (<Button
                    key={region.id}
                    onClick={() => props.progress(region.id)}>
                    {props.state.flags.replaceFlagsWithValues(region.name)}
                </Button>)
            })}
            <Button key={0} onClick={() => props.progress("next")}>
                {t("next")}
            </Button>
        </div>
    );

}

function ExamResult(props: IExamResultProps) {
    const {t} = useTranslation();
    return (
        <div>
            <SceneHeader text=""/>
            <SceneTextbox text={props.result.result}/>
            <Button onClick={() => props.progress(0)}>{t("next")}</Button>
        </div>
    );

}

interface IExamResultProps {
    state: StateInfo,
    progress: Function,
    result: PhysicalExamResults
};

interface IExamResultOptionsProps{
    state: StateInfo,
    progress: Function,
    options: Array<PhysicalExamRegion>
};
