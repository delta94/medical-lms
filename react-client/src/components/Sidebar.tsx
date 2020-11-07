import React, {useState} from "react";
import {Collapse, Nav, Navbar, NavItem} from "react-bootstrap";
import NavbarCollapse from "react-bootstrap/NavbarCollapse";
import If, {Else, Then} from "./If";
import {Role} from "../api/v1/UserApi";
import NavLink from "react-bootstrap/NavLink";
import {IndexLinkContainer} from "react-router-bootstrap";
import {useGlobalState} from "state/GlobalState";
import Icon from "./Icon";
import {useTranslation} from "react-i18next";
import {IfFeature} from "./IfFeature";
import Image from "react-bootstrap/Image";

export default function Sidebar() {
    const [globalState] = useGlobalState();
    const [manageOpen, setManageOpen] = useState<boolean>(false);
    const [adminOpen, setAdminOpen] = useState<boolean>(false);
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

    const {t} = useTranslation();

    return (
        <Navbar variant="dark" bg="primary" className="flex-column h-100" id="sidebar">
            <NavbarCollapse id="sidebar-collapse">
                <Nav as="ul">
                    <If conditional={globalState.user.email}>
                        <Then>
                            <NavItem as="li" onClick={() => {
                                setManageOpen(false);
                                setAdminOpen(false);
                                setSettingsOpen(false);
                            }}>
                                <IndexLinkContainer to="/dashboard">
                                    <NavLink title={t("dashboard")} as="h4" className="ellipsis"><Icon
                                        className="align-bottom">dashboard</Icon> {t("dashboard")}</NavLink>
                                </IndexLinkContainer>
                            </NavItem>
                            <NavItem as="li" onClick={() => {
                                setAdminOpen(false);
                                setManageOpen(false);
                                setSettingsOpen(false);
                            }}>
                                <IndexLinkContainer to="/resources">
                                    <NavLink title={t("resources")} as="h4" className="ellipsis"><Icon
                                        className="align-bottom">local_library</Icon> {t("resources")}</NavLink>
                                </IndexLinkContainer>
                            </NavItem>
                            <If conditional={globalState.user.role >= Role.SuperUser}>
                                <NavItem title={t("manage")} className="not-mobile" as="li">
                                    <NavLink onClick={() => {
                                        setManageOpen(!manageOpen);
                                    }}>
                                        <h4 className="ellipsis">
                                            <Icon className="align-bottom">table_chart</Icon> <span>{t("manage")}</span>
                                            <If conditional={manageOpen} hasElse={true}>
                                                <Then>
                                                    <Icon>keyboard_arrow_down</Icon>
                                                </Then>
                                                <Else>
                                                    <Icon>keyboard_arrow_right</Icon>
                                                </Else>
                                            </If>
                                        </h4>
                                    </NavLink>
                                    <Collapse in={manageOpen}>
                                        <Nav as="ul" className="shift-list">
                                            <NavItem title={t("users")} as="li" onClick={() => setAdminOpen(false)}>
                                                <IndexLinkContainer to="/manage/users">
                                                    <NavLink as="h4" className="ellipsis"><Icon
                                                        className="align-bottom">person</Icon> {t("users")}</NavLink>
                                                </IndexLinkContainer>
                                            </NavItem>
                                            <NavItem title={t("groups")} as="li" onClick={() => setAdminOpen(false)}>
                                                <IndexLinkContainer to="/manage/groups">
                                                    <NavLink as="h4" className="ellipsis"><Icon
                                                        className="align-bottom">people</Icon> {t("groups")}</NavLink>
                                                </IndexLinkContainer>
                                            </NavItem>
                                            <NavItem title={t("resources")} as="li" onClick={() => setAdminOpen(false)}>
                                                <IndexLinkContainer to="/manage/resources">
                                                    <NavLink as="h4"
                                                             className="ellipsis"><Icon>local_library</Icon> {t("resources")}
                                                    </NavLink>
                                                </IndexLinkContainer>
                                            </NavItem>
                                            <NavItem title={t("patients")} as="li" onClick={() => setAdminOpen(false)}>
                                                <IndexLinkContainer to="/manage/patients">
                                                    <NavLink as="h4" className="ellipsis"><Icon
                                                        className="align-bottom">assignment_ind</Icon> {t("patients")}
                                                    </NavLink>
                                                </IndexLinkContainer>
                                            </NavItem>
                                            <NavItem title={t("scenarios")} as="li" onClick={() => setAdminOpen(false)}>
                                                <IndexLinkContainer to="/manage/scenarios">
                                                    <NavLink as="h4" className="ellipsis"><Icon
                                                        className="align-bottom">assignment</Icon> {t("scenarios")}
                                                    </NavLink>
                                                </IndexLinkContainer>
                                            </NavItem>
                                        </Nav>
                                    </Collapse>
                                </NavItem>
                            </If>

                            <If conditional={globalState.user.role >= Role.SuperUser}>
                                <NavItem title={t("settings")} className="not-mobile" as="li">
                                    <NavLink onClick={() => {
                                        setSettingsOpen(!settingsOpen);
                                    }}>
                                        <h4 className="ellipsis">
                                            <Icon className="align-bottom">settings</Icon> <span>{t("settings")}</span>
                                            <If conditional={settingsOpen} hasElse={true}>
                                                <Then>
                                                    <Icon>keyboard_arrow_down</Icon>
                                                </Then>
                                                <Else>
                                                    <Icon>keyboard_arrow_right</Icon>
                                                </Else>
                                            </If>
                                        </h4>
                                    </NavLink>
                                    <Collapse in={settingsOpen}>
                                        <Nav as="ul" className="shift-list">
                                            <NavItem title={t("details")} as="li" onClick={() => {
                                                setManageOpen(false);
                                                setAdminOpen(false);
                                            }}>
                                                <IndexLinkContainer to="/settings/details">
                                                    <NavLink as="h4" className="ellipsis">
                                                        <Icon className="align-bottom">description</Icon> <span>{t("details")}</span>
                                                    </NavLink>
                                                </IndexLinkContainer>
                                            </NavItem>
                                            <IfFeature feature="saml">
                                                <NavItem title={t("sso")} as="li" onClick={() => {
                                                    setManageOpen(false);
                                                    setAdminOpen(false);
                                                }}>
                                                    <IndexLinkContainer to="/settings/sso">
                                                        <NavLink as="h4" className="ellipsis">
                                                            <Icon className="align-bottom">vpn_key</Icon> <span>SSO</span>
                                                        </NavLink>
                                                    </IndexLinkContainer>
                                                </NavItem>
                                            </IfFeature>
                                        </Nav>
                                    </Collapse>
                                </NavItem>
                            </If>
                            <If conditional={globalState.user.role === Role.Admin}>
                                <NavItem title={t("admin")} className="not-mobile" as="li">
                                    <NavLink onClick={(e) => {
                                        setAdminOpen(!adminOpen);
                                    }}>
                                        <h4 className="ellipsis">
                                            <Icon className="align-bottom">build</Icon> <span>{t("admin")}</span>
                                            <If conditional={adminOpen} hasElse={true}>
                                                <Then>
                                                    <Icon>keyboard_arrow_down</Icon>
                                                </Then>
                                                <Else>
                                                    <Icon>keyboard_arrow_right</Icon>
                                                </Else>
                                            </If>
                                        </h4>
                                    </NavLink>
                                    <Collapse in={adminOpen}>
                                        <Nav as="ul" className="shift-list">
                                            <NavItem title={t("clients")} as="li" onClick={() => setManageOpen(false)}>
                                                <IndexLinkContainer to="/admin/clients">
                                                    <NavLink as="h4" className="ellipsis"><Icon
                                                        className="align-bottom">school</Icon> {t("clients")}</NavLink>
                                                </IndexLinkContainer>
                                            </NavItem>
                                        </Nav>
                                    </Collapse>
                                </NavItem>
                                <NavItem className="mt-auto">
                                    <Image fluid src={globalState.client.logo}/>
                                </NavItem>
                            </If>
                        </Then>
                    </If>
                </Nav>
            </NavbarCollapse>
        </Navbar>
    );
}
