import React, {useState} from "react";
import {Card, Table} from "react-bootstrap";
import {FormattedDate} from "components/FormatedDate";
import {ClientApi, emptyClient} from "api/v1/ClientApi";
import {useTranslation} from "react-i18next";
import {IconLink} from "../../../components/IconLink";
import {Check} from "../../../components/Check";

export function ManageClient(props: IManageClientProps) {
    const [client, setClient] = useState(emptyClient());

    const {t} = useTranslation();

    function refresh() {
        ClientApi.findById(props.clientId)
            .then(data => {
                setClient(data);
            });
    }

    if (client.id === 0 && props.clientId !== 0) {
        refresh();
    }

    return (
        <div>
            <Card>
                <Card.Header>{t("details")}</Card.Header>
                <Card.Body>
                    <Table>
                        <tbody>
                        <tr>
                            <th>{t("name")}</th>
                            <td>{client.name}</td>
                        </tr>
                        <tr>
                            <th>{t("disabled")}</th>
                            <td><Check value={client.disabled} /></td>
                        </tr>
                        <tr>
                            <th>{t("subdomain")}</th>
                            <td>{client.subdomain}</td>
                        </tr>
                        <tr>
                            <th>{t("created-at")}</th>
                            <td><FormattedDate date={client.createdAt}/></td>
                        </tr>
                        <tr>
                            <th>{t("updated-at")}</th>
                            <td><FormattedDate date={client.updatedAt}/></td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <br />

            <IconLink to={`/admin/clients/${props.clientId}/manage/users`} title={t("users")} icon="person"/>
            <IconLink to={`/admin/clients/${props.clientId}/manage/groups`} title={t("groups")} icon="people"/>
            <IconLink to={`/admin/clients/${props.clientId}/manage/resources`} title={t("resources")} icon="local_library"/>
            <IconLink to={`/admin/clients/${props.clientId}/manage/patients`} title={t("patients")} icon="assignment_ind"/>
            <IconLink to={`/admin/clients/${props.clientId}/manage/scenarios`} title={t("scenarios")} icon="assignment"/>
        </div>
    );
}

export interface IManageClientProps {
    clientId: number;
}
