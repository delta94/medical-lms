import React, {useState} from "react";
import {Container} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import {RecoveryCodes} from "../../components/RecoveryCodes";
import {Redirect} from "react-router-dom";
import {MfaApi} from "../../api/v1/MfaApi";
import Button from "react-bootstrap/Button";
import {useTranslation} from "react-i18next";

export function ViewMfaRecoveryCodes(props: IViewMfaRecoveryCodesProps) {
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
    const [redirect, setRedirect] = useState(false);

    const {t} = useTranslation();

    if (props.method !== "U2F" && props.method !== "TOTP")
        return <Redirect to="/"/>;
    if (recoveryCodes.length === 0) {
        console.log("test");
        MfaApi.generateRecoveryCodes()
            .then(data => {
                if (data.success) {
                    MfaApi.findRecoveryCodes()
                        .then(data => {
                            setRecoveryCodes(data);
                        })
                } else {
                    console.error("An error occured");
                }
            });
    }

    if (redirect) {
        if (props.method === "U2F") {
            return <Redirect to="/account/security/2fa/u2f"/>;
        } else if (props.method === "TOTP") {
            return <Redirect to="/account/security/2fa/totp" />;
        } else {
            console.error(`This is an impossible situation. 
            Method Prop is ${props.method} but it can only be U2F or TOTP.
            A redirect should have occurred. Please refresh the page.`)
        }
    }

    return (
        <Container>
            <Card>
                <Card.Header>
                    <h2>1. Recovery Codes</h2>
                    <h5>Recovery codes are used to access your account in the event you can't access other two-factor
                        methods.</h5>
                </Card.Header>
                <Card.Body>
                    <RecoveryCodes value={recoveryCodes}/>
                </Card.Body>
                <Card.Footer>
                    <div className="float-right">
                        <Button onClick={() => setRedirect(true)}>
                            {t("next")}
                        </Button>
                    </div>
                </Card.Footer>
            </Card>
        </Container>
    );
}

export interface IViewMfaRecoveryCodesProps {
    method: "U2F" | "TOTP"
}