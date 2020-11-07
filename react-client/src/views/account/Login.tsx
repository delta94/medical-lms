import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import {useGlobalState} from "state/GlobalState";
import {AccountApi} from "api/v1/AccountApi";
import If, {Then} from "components/If";
import {Alert, Button, Card, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {parse} from "query-string";
import {IfFeature} from "../../components/IfFeature";
import {FeatureFlagApi} from "../../api/v1/FeatureFlagApi";
import Image from "react-bootstrap/Image";

export default function Login(props: ILoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [showMfaCode, setShowMfaCode] = useState(false);
    const [useRecoveryCode, setUseRecoveryCode] = useState(false);
    const [globalState, dispatch] = useGlobalState();

    const {t} = useTranslation();

    if (globalState.features === null) {
        FeatureFlagApi.getEnabledFeatures()
            .then(data => {
                dispatch({
                    type: "setFeatures",
                    features: data
                });
            });
    }

    if (globalState.client.id === 0) {
        AccountApi.getClient()
            .then(data => {
                dispatch({
                    type: "setClient",
                    newClient: data
                });
            });
    }

    function ssoLogin() {
        AccountApi.samlLogin()
            .then(res => {
                let domParser = new DOMParser();
                let doc = domParser.parseFromString(res, "text/html");
                if (doc) {
                    let url = doc.forms[0].action;
                    let samlRequest = "";
                    let relayState = "";
                    let inputs = doc.querySelectorAll("input");
                    inputs.forEach((item) => {
                        if (item.name === "SAMLRequest")
                            samlRequest = item.value;
                        if (item.name === "RelayState")
                            relayState = item.value;
                    })
                    window.location.href = `${url}?SAMLRequest=${encodeURIComponent(samlRequest)}&RelayState=${relayState}`;
                }
            });
    }

    function login() {
        setError("");
        if (showMfaCode) {
            if (code) {
                AccountApi.totpLogin(email, password, code, useRecoveryCode)
                    .then(res => {
                        window.localStorage.setItem("token", res.access_token);

                        dispatch({
                            type: "setUser",
                            newUser: res.user
                        });
                    })
                    .catch(err => {
                        switch (err.statusCode) {
                            case 401: {
                                setError(t("invalid-code"));
                                break;
                            }
                            default: {
                                setError(t("server-error"));
                                break;
                            }
                        }
                    });
            }
        } else {
            AccountApi.login(email, password)
                .then(res => {
                    if (!res.mfaEnabled) {
                        window.localStorage.setItem("token", res.access_token);

                        dispatch({
                            type: "setUser",
                            newUser: res.user
                        });
                    } else {
                        setShowMfaCode(true);
                    }
                })
                .catch(err => {
                    switch (err.statusCode) {
                        case 401: {
                            setError(t("incorrect-password"));
                            break;
                        }
                        case 403: {
                            setError(t("account-disabled"));
                            break;
                        }
                        case 404: {
                            setError(t("account-not-found"));
                            break;
                        }
                        default: {
                            setError(t("server-error"));
                            break;
                        }
                    }
                });
        }
    }

    if (globalState.user.email) {
        return <Redirect to="/dashboard"/>
    }

    let query = parse(window.location.search);
    let accessToken = query["access_token"] as string;
    if (accessToken) {
        window.localStorage.setItem("token", accessToken);
        return <Redirect to="/dashboard" />;
    }

    return (
        <div>
            <Card className="w-75 mx-auto">
                <Card.Header>
                    <h3>{t("login")}</h3>
                </Card.Header>
                <Card.Body>
                    <If conditional={globalState.client.logo}>
                        <FormGroup>
                            <Image alt="Logo" fluid src={globalState.client.logo}/>
                        </FormGroup>
                    </If>
                    <FormGroup>
                        <FormLabel htmlFor="email">{t("email")}</FormLabel>
                        <FormControl id="email" disabled={showMfaCode} name="email" autoComplete="username email" value={email}
                                     onChange={(e) => setEmail(e.target.value)} type="email"/>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="password">{t("password")}</FormLabel>
                        <FormControl id="password" disabled={showMfaCode} name="password" autoComplete="password" value={password}
                                     onChange={(e) => setPassword(e.target.value)} type="password"/>
                    </FormGroup>
                    <If conditional={showMfaCode}>
                        <Then>
                            <FormGroup>
                                <FormLabel htmlFor="code">{useRecoveryCode ? t("recovery-code") : t("code")}</FormLabel>
                                <FormControl maxLength={useRecoveryCode ? 8 : 6} id="code" placeholder={useRecoveryCode ? "1abc23d4" : "123456"}
                                             value={code ?? ""} onChange={(e) => setCode(e.target.value)}/>
                            </FormGroup>
                            <Button variant="link" className="d-block" onClick={() => setUseRecoveryCode(!useRecoveryCode)}>{useRecoveryCode ? t("use-normal-code") : t("use-recovery-code")}</Button>
                        </Then>
                    </If>

                    <If conditional={error !== "" && error !== null}>
                        <Alert variant="danger">
                            {error}
                        </Alert>
                    </If>

                    <Button variant="primary" onClick={login}>{t("login")}</Button>
                </Card.Body>
                <IfFeature feature="saml">
                    <Card.Footer>
                        <Button variant="link" onClick={ssoLogin}>Login with organisation</Button>
                    </Card.Footer>
                </IfFeature>
            </Card>
        </div>
    );
}

export interface ILoginProps {

}