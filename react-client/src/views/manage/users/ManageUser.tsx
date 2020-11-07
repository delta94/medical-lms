import React, {useState} from "react";
import {emptyUser, UserApi} from "api/v1/UserApi";
import {Breadcrumb, Card} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {IndexLinkContainer} from "react-router-bootstrap";
import {UserRole} from "../../../components/UserRole";
import {FormattedDate} from "../../../components/FormatedDate";
import Table from "react-bootstrap/Table";
import If from "../../../components/If";
import {useGlobalState} from "../../../state/GlobalState";
import {Check} from "../../../components/Check";

export function ManageUser(props: IManageUserProps) {
    const [globalState] = useGlobalState();
    const [user, setUser] = useState(emptyUser());
    const {t} = useTranslation();

    function refresh() {
        UserApi.findById(props.clientId, props.userId)
            .then(data => {
                setUser(data);
            });
    }

    if (user.id === 0) {
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
                    <IndexLinkContainer to={`/admin/clients/${props.clientId}/manage/users`}>
                        <Breadcrumb.Item>{t("users")}</Breadcrumb.Item>
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
                            <td>{user.name}</td>
                        </tr>
                        <tr>
                            <th>{t("email")}</th>
                            <td>{user.email}</td>
                        </tr>
                        <tr>
                            <th>{t("role")}</th>
                            <td><UserRole value={user.role} /></td>
                        </tr>
                        <tr>
                            <th>{t("disabled")}</th>
                            <td><Check value={user.disabled} /></td>
                        </tr>
                        <tr>
                            <th>{t("created-at")}</th>
                            <td><FormattedDate date={user.createdAt}/></td>
                        </tr>
                        <tr>
                            <th>{t("updated-at")}</th>
                            <td><FormattedDate date={user.updatedAt}/></td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
}

export interface IManageUserProps {
    clientId: number;
    userId: number;
}