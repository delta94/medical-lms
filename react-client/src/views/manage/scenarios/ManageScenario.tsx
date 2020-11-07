import React, {useState} from "react";
import {Breadcrumb, Card} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {FormattedDate} from "../../../components/FormatedDate";
import Table from "react-bootstrap/Table";
import {Check} from "../../../components/Check";
import {emptyScenario, ScenarioApi} from "../../../api/v1/ScenarioApi";
import If, {Else, Then} from "../../../components/If";
import {IndexLinkContainer} from "react-router-bootstrap";
import {useGlobalState} from "../../../state/GlobalState";
import ScenarioPatientTable from "./patients/ScenarioPatientTable";
import {Link} from "react-router-dom";
import ScenarioEnvironmentTable from "./environments/ScenarioEnvironmentTable";
import ScenarioSpeakerTable from "./ScenarioSpeakerTable";

export function ManageScenario(props: IManageScenarioProps) {
    const [globalState] = useGlobalState();
    const [scenario, setScenario] = useState(emptyScenario());
    const {t} = useTranslation();

    function refresh() {
        ScenarioApi.findById(props.clientId, props.scenarioId)
            .then(data => {
                setScenario(data);
            });
    }

    if (scenario.id === 0) {
        refresh();
    }

    return (
        <div>
            <If conditional={globalState.user.clientId !== props.clientId}>
                <Breadcrumb>
                    <IndexLinkContainer to="/admin/clients">
                        <Breadcrumb.Item>{t("clients")}</Breadcrumb.Item>
                    </IndexLinkContainer>
                    <IndexLinkContainer to={`/admin/clients/${props.clientId}`}>
                        <Breadcrumb.Item>{t("manage")}</Breadcrumb.Item>
                    </IndexLinkContainer>
                    <IndexLinkContainer to={`/admin/clients/${props.clientId}/manage/scenarios`}>
                        <Breadcrumb.Item>{t("scenarios")}</Breadcrumb.Item>
                    </IndexLinkContainer>
                    <Breadcrumb.Item active>{t("manage")}</Breadcrumb.Item>
                </Breadcrumb>
            </If>
            <Card className="mb-4">
                <Card.Header>{t("details")}</Card.Header>
                <Card.Body>
                    <Table>
                        <tbody>
                        <tr>
                            <th>{t("name")}</th>
                            <td>{scenario.name}</td>
                        </tr>
                        <tr>
                            <th>{t("description")}</th>
                            <td>{scenario.description}</td>
                        </tr>
                        <tr>
                            <th>{t("active")}</th>
                            <td><Check value={scenario.active}/></td>
                        </tr>
                        <tr>
                            <th>{t("cover-image")}</th>
                            <td>
                                <If conditional={scenario.coverImage}>
                                    <img width={100} className="img-fluid" src={scenario.coverImage}
                                         alt={scenario.name}/>
                                </If>
                            </td>
                        </tr>
                        <tr>
                            <th>{t("created-at")}</th>
                            <td><FormattedDate date={scenario.createdAt}/></td>
                        </tr>
                        <tr>
                            <th>{t("updated-at")}</th>
                            <td><FormattedDate date={scenario.updatedAt}/></td>
                        </tr>
                        <tr>
                            <th>{t("decision-tree")}</th>
                            <td>
                                <If conditional={globalState.user.clientId !== props.clientId} hasElse={true}>
                                    <Then>
                                        <Link className="btn btn-primary" to={`/admin/clients/${props.clientId}/manage/scenarios/${props.scenarioId}/graph`}>{t("update")}</Link>
                                    </Then>
                                    <Else>
                                        <Link className="btn btn-primary" to={`/manage/scenarios/${props.scenarioId}/graph`}>{t("update")}</Link>
                                    </Else>
                                </If>
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <ScenarioPatientTable className="mt-5" clientId={props.clientId} scenarioId={props.scenarioId}/>
            <ScenarioEnvironmentTable className="mt-5" clientId={props.clientId} scenarioId={props.scenarioId}/>
            <ScenarioSpeakerTable className="mt-5" clientId={props.clientId} scenarioId={props.scenarioId}/>
        </div>
    );
}

export interface IManageScenarioProps {
    clientId: number;
    scenarioId: number;
}
