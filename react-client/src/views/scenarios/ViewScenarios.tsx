import React, {useState} from "react";
import {Scenario, ScenarioApi} from "../../api/v1/ScenarioApi";
import {emptyPaginatedList, QueryRequest} from "../../api/QueryRequest";
import CardColumns from "react-bootstrap/CardColumns";
import {Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import If from "../../components/If";
import {useTranslation} from "react-i18next";

export default function ViewScenarios(props: IViewScenariosProps) {
    const [scenarios, setScenarios] = useState(emptyPaginatedList<Scenario>());
    const [query] = useState(new QueryRequest());
    const [loaded, setLoaded] = useState(false);

    const {t} = useTranslation();

    const defaultImage = "https://d3orux5vnntoh6.cloudfront.net/1.11.77/img/cu-logo.svg";

    if (!loaded) {
        ScenarioApi.findNotEmpty(props.clientId, query)
            .then((result) => {
                setScenarios(result);
                setLoaded(true);
            });
    }

    return (
        <div>
            <If conditional={scenarios.totalCount === 0}>
                <div>
                    <h4>{t("no-scenarios-available")}</h4>
                </div>
            </If>
            <CardColumns>
                {scenarios.list.map((s) => {
                    return (
                        <Card key={s.id} border="secondary">
                            <Card.Img variant="top" src={s.coverImage || defaultImage}/>
                            {/*This link doesn't appear but makes the whole card clickable*/}
                            <Link to={`scenarios/${s.id.toString()}`} className="stretched-link"/>

                            <Card.Body>
                                <Card.Title>{s.name}</Card.Title>
                                <Card.Text>{s.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    )
                })}
            </CardColumns>
        </div>
    );
}

export interface IViewScenariosProps {
    clientId: number;
}