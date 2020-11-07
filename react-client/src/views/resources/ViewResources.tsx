import React, {useState} from "react";
import {Resource, ResourceApi} from "../../api/v1/ResourceApi";
import {Card} from "react-bootstrap";
import {emptyPaginatedList, IPaginatedList, IQueryRequest, QueryRequest} from "../../api/QueryRequest";
import {Link} from "react-router-dom";
import If, {Else} from "../../components/If";
import {useTranslation} from "react-i18next";
import CardColumns from "react-bootstrap/CardColumns";

export default function ViewResources(props: IResourceProps) {
    const [data, setData] = useState<IPaginatedList<Resource>>(emptyPaginatedList());
    const [loaded, setLoaded] = useState(false);
    const [query] = useState<IQueryRequest>(new QueryRequest());
    const [queryUpdated, setQueryUpdated] = useState(false);

    const {t} = useTranslation();

    function refresh() {
        ResourceApi.find(props.clientId, query)
            .then(data => {
                setData(data);
                setLoaded(true);
            });
    }


    if (!loaded && props.clientId !== 0) {
        refresh();
    }

    if (queryUpdated) {
        refresh();
        setQueryUpdated(false);
    }

    return (
        <div>
            <If conditional={data.list.length === 0}>
                <div>
                    <h4>{t("no-resources-available")}</h4>
                </div>
            </If>
            <Else>
                <CardColumns>
                    {data.list.map(function (r) {
                        return (
                            <Card key={r.id} border="secondary" className="mb-4">
                                <Card.Header>{r.type}</Card.Header>
                                <Card.Body>
                                    <Card.Text><Link to={`/resources/${r.id}`}>{r.name}</Link>: {r.description}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </CardColumns>
            </Else>
        </div>
    );
}

export interface IResourceProps {
    clientId: number;
}
