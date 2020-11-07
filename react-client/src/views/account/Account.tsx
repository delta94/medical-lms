import React from "react";
import {Card, Nav, Tab} from "react-bootstrap";
import Profile from "./Profile";
import Security from "./Security";
import {useTranslation} from "react-i18next";

export default function Account(props: {page: string}) {
    const {t} = useTranslation();

    return (
        <Tab.Container defaultActiveKey={props.page}>
        <Card>
            <Card.Header>
                <Nav variant="tabs">
                    <Nav.Item>
                        <Nav.Link onClick={(e) => {
                            e.preventDefault();
                            window.history.pushState({}, "", "/account/profile");
                        }} eventKey="profile">{t("profile")}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={(e) => {
                            e.preventDefault();
                            window.history.pushState({}, "", "/account/security");
                        }} eventKey="security">{t("security")}</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Card.Header>
            <Card.Body>
                <Tab.Content>
                    <Tab.Pane eventKey="profile">
                        <Profile/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="security">
                        <Security />
                    </Tab.Pane>
                </Tab.Content>
            </Card.Body>
        </Card>
</Tab.Container>

    );
}