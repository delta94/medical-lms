import React, {useState} from "react";
import {useGlobalState} from "state/GlobalState";
import {Breadcrumb, Card, Table} from "react-bootstrap";
import {FormattedDate} from "components/FormatedDate";
import {emptyGroup, GroupApi} from "api/v1/GroupApi";
import GroupMemberTable from "./GroupMemberTable";
import {useTranslation} from "react-i18next";
import If from "components/If";
import {IndexLinkContainer} from "react-router-bootstrap";
import ChildGroupTable from "./ChildGroupTable";

export function ManageGroup(props: IManageGroupProps) {
    const [globalState] = useGlobalState();
    const [group, setGroup] = useState(emptyGroup());
    const {t} = useTranslation();

    function refresh() {
        GroupApi.findById(props.clientId, props.groupId)
            .then(data => {
                if (!data.isEveryone)
                    setGroup(data);
            });
    }

    if (group.id === 0) {
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
                    <IndexLinkContainer to={`/admin/clients/${props.clientId}/manage/groups`}>
                        <Breadcrumb.Item>{t("groups")}</Breadcrumb.Item>
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
                            <td>{group.name}</td>
                        </tr>
                        <tr>
                            <th>{t("created-at")}</th>
                            <td><FormattedDate date={group.createdAt}/></td>
                        </tr>
                        <tr>
                            <th>{t("updated-at")}</th>
                            <td><FormattedDate date={group.updatedAt}/></td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <ChildGroupTable className="mt-5" clientId={props.clientId} groupId={props.groupId}/>
            <GroupMemberTable className="mt-5" clientId={props.clientId} groupId={props.groupId}/>
        </div>
    );
}

export interface IManageGroupProps {
    clientId: number;
    groupId: number;
}