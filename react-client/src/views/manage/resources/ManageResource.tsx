import React, {useState} from "react";
import {useGlobalState} from "state/GlobalState";
import {emptyResource, ResourceApi} from "../../../api/v1/ResourceApi";
import {Breadcrumb, Card, Table} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import If from "../../../components/If";
import {IndexLinkContainer} from "react-router-bootstrap";

export function ManageResource(props: IManageResourceProps) {
    const [globalState] = useGlobalState();
    const [resource, setResource] = useState(emptyResource());

    const {t} = useTranslation();

    function refresh() {
        ResourceApi.findById(props.clientId, props.resourceId)
            .then(data => {
                setResource(data);
            });
    }

    if (resource.id === 0) {
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
                    <IndexLinkContainer to={`/admin/clients/${props.clientId}/manage/resources`}>
                        <Breadcrumb.Item>{t("resources")}</Breadcrumb.Item>
                    </IndexLinkContainer>
                    <Breadcrumb.Item active>{t("manage")}</Breadcrumb.Item>
                </Breadcrumb>
            </If>
            <Card>
                <Card.Header>{t("details")}</Card.Header>
                <Card.Body>
                    <Table>
                        <tbody>
                        <tr>
                            <th>{t("name")}</th>
                            <td>{resource.name}</td>
                        </tr>
                        <tr>
                            <th>{t("category")}</th>
                            <td>{resource.type}</td>
                        </tr>
                        <tr>
                            <th>{t("description")}</th>
                            <td>{resource.description}</td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <br />
            <span dangerouslySetInnerHTML={{__html: resource.html}} />
        </div>
    );
}

export interface IManageResourceProps {
    clientId: number;
    resourceId: number;
}
