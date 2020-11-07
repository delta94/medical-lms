import React, {useState} from "react";
import {PhysicalExamResultsApi, PhysicalExamResultsFind} from "../../../api/v1/PhysicalExamResultsApi";
import {emptyPaginatedList, IPaginatedList, IQueryRequest, QueryRequest} from "../../../api/QueryRequest";
import If, {Else} from "../../../components/If";
import CreateOrUpdatePhysicalExamResults from "./CreateOrUpdatePhysicalExamResult";
import {Button, Card, ListGroup} from "react-bootstrap";
import {UpdateIcon} from "../../../components/CrudIcons";
import {useTranslation} from "react-i18next";
import Icon from "../../../components/Icon";

export default function PhysicalExamResultsComponent(props: IExamResultsProps) {
    const [showModal, setShowModal] = useState(false);
    const [examResult, setExamResult] = useState<IPaginatedList<PhysicalExamResultsFind>>(emptyPaginatedList());
    const [queryRequest] = useState<IQueryRequest>(new QueryRequest(1, 20));
    const [queryUpdated, setQueryUpdated] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [updateExamResultId, setUpdateExamResultId] = useState<number | null>(null);

    const {t} = useTranslation();

    function refresh() {
        PhysicalExamResultsApi.find(props.clientId, props.patientId, queryRequest)
            .then(data => {
                setExamResult(data);
            })
    }

    if (queryUpdated) {
        refresh();
        setQueryUpdated(false);
    }

    if (!loaded && props.clientId !== 0) {
        setLoaded(true);
        refresh();
    }

    return (
        <div>
            <If conditional={showModal}>
                <CreateOrUpdatePhysicalExamResults clientId={props.clientId} patientId={props.patientId}
                                                   id={updateExamResultId}
                                                   hide={() => setShowModal(false)} success={() => {
                    setShowModal(false);
                    refresh();
                }}/>
            </If>
            <Card>
                <Card.Header>
                    {t("physical-exam-regions")}
                    <Button className="float-right rounded-pill" variant="primary" size={"sm"}
                            onClick={() => {
                                setUpdateExamResultId(null)
                                setShowModal(true);
                            }}>
                        <Icon className="text-white align-bottom">add</Icon>
                    </Button>
                </Card.Header>
                <Card.Body>
                    <If conditional={examResult.list.length === 0}>
                        <h4>{t("no-exam-results-available")}</h4>
                    </If>
                    <Else>
                        <ListGroup variant={"flush"}>
                            {examResult.list.map((r) => {
                                return (
                                    <ListGroup.Item className="d-inline-flex" key={r.id}>
                                        {r.name}: {r.result} <UpdateIcon onClick={() => {
                                        setShowModal(true);
                                        setUpdateExamResultId(r.id);
                                    }}/></ListGroup.Item>
                                )
                            })}
                        </ListGroup>
                    </Else>
                </Card.Body>
            </Card>
        </div>)

}

export interface IExamResultsProps {
    clientId: number;
    patientId: number;
}
