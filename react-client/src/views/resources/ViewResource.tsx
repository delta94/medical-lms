import React, {useState} from "react";
import {emptyResource, ResourceApi} from "../../api/v1/ResourceApi";

export default function ViewResource(props: IManageResourceProps) {
    const [resource, setResource] = useState(emptyResource());

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
            <h4>{resource.name}</h4>
            <br/>
            <span dangerouslySetInnerHTML={{__html: resource.html}} />
        </div>
    );
}

export interface IManageResourceProps {
    clientId: number;
    resourceId: number;
}
