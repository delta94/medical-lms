import React from "react";
import {Card} from "react-bootstrap";
import Icon from "./Icon";
import {Link} from "react-router-dom";

export function IconLink(props: IIconLinkProps) {
    return (
        <Link to={props.to}>
            <Card className="w-fc d-inline-block m-2">
                <Card.Body style={{alignSelf: "center"}} className="text-center">
                    <Icon className="h1">{props.icon}</Icon>
                </Card.Body>
                <Card.Footer>
                    <h5>{props.title}</h5>
                </Card.Footer>
            </Card>
        </Link>
    );
}

export interface IIconLinkProps {
    to: string;
    icon: string;
    title: string;
}