import {useGlobalState} from "state/GlobalState";
import Sidebar from "./Sidebar";
import React, {useState} from "react";
import If from "./If";
import {IndexLinkContainer} from "react-router-bootstrap";
import {Nav, Navbar, NavbarBrand, NavDropdown} from "react-bootstrap";
import Icon from "./Icon";
import {useTranslation} from "react-i18next";

export function Navigation(props: { sidebarToggle: Function }) {
    const [globalState] = useGlobalState();
    const mobile = matchMedia("(max-width: 599px)").matches;
    const [showSidebar, setShowSidebar] = useState(!mobile);

    const {t} = useTranslation();

    function logout(e) {
        e.preventDefault();
        window.localStorage.clear();
        window.location.reload();
    }

    if (globalState.user.id === 0) {
        if (showSidebar)
            setShowSidebar(false);
    } else {
        if (!mobile && !showSidebar) {
            setShowSidebar(true);
        }
    }

    props.sidebarToggle(showSidebar);

    return (
        <div className="h-100">
            <Navbar fixed="top" variant="dark" bg="primary" id="topbar">
                <If conditional={globalState.user.email}>
                    <Icon className="mobile-only text-white clickable mr-3" onClick={() => {
                        setShowSidebar(!showSidebar);
                    }}>menu</Icon>
                </If>
                <IndexLinkContainer to="/dashboard" style={{color: "#fff", marginRight: 0, verticalAlign: "middle"}}>
                    <NavbarBrand>
                        <h3 className="mb-0">Medical LMS</h3>
                    </NavbarBrand>
                </IndexLinkContainer>
                <Nav className="mr-auto">
                </Nav>
                <Nav>
                    <If conditional={globalState.user.name}>
                        <NavDropdown alignRight id="account-dropdown" title={globalState.user.name || ""}>
                            <IndexLinkContainer to="/account/profile"><NavDropdown.Item><Icon
                                className="align-bottom">account_circle</Icon> {t("account")}
                            </NavDropdown.Item></IndexLinkContainer>
                            <NavDropdown.Item onClick={logout}><Icon
                                className="align-bottom">exit_to_app</Icon> {t("logout")}</NavDropdown.Item>
                        </NavDropdown>
                    </If>
                </Nav>
            </Navbar>
            <If conditional={showSidebar}>
                <Sidebar/>
            </If>
        </div>
    );
}