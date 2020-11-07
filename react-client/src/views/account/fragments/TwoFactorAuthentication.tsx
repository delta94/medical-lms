import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import {Redirect} from "react-router-dom";
import {MfaApi} from "../../../api/v1/MfaApi";
import If, {Else, Then} from "components/If";
import {RecoveryCodesManagement} from "./RecoveryCodesManagement";
import {IfFeature} from "../../../components/IfFeature";

export function TwoFactorAuthentication(props: ITwoFactorAuthenticationProps) {
    const [mfaIsSetup, setMfaIsSetup] = useState(false);
    const [checkedMfaStatus, setCheckedMfaStatus] = useState(false);

    const [recoveryMode, setRecoveryMode] = useState<null | "U2F" | "TOTP">(null);

    const {t} = useTranslation();

    if (recoveryMode) {
        return <Redirect to={`/account/security/2fa/recovery-codes/${recoveryMode}`}/>;
    }

    if (!checkedMfaStatus) {
        setCheckedMfaStatus(true);
        MfaApi.mfaIsSetup()
            .then(data => {
                setMfaIsSetup(data.enabled);
            });
    }

    return (
        <div>
            <h2>{t("two-factor-authentication")}</h2>
            <p>Two-factor authentication adds additional security to your account by requiring more than just your
                password to log in.</p>
            {mfaIsSetup}
            <If conditional={mfaIsSetup} hasElse={true}>
                <Then>
                    <div>
                        <RecoveryCodesManagement/>
                    </div>
                </Then>
                <Else>
                    <Row className="pt-2">
                        <IfFeature feature="mfa-fido">
                            <Col>
                                <p>Use a U2F authenticator such as <a rel="noopener noreferrer"
                                                                      href="https://www.yubico.com/store/"
                                                                      target="_blank">YubiKey</a>
                                    or Biometrics (e.g. Fingerprint sensor).</p>
                                <div className="text-center">
                                    <Button variant="primary" onClick={() => setRecoveryMode("U2F")}>
                                        Set up a U2F authenticator
                                    </Button>
                                </div>
                            </Col>
                        </IfFeature>
                        <IfFeature feature="mfa-totp">
                            <Col>
                                <p>Use an application on your phone to get authentication codes when prompted.</p>
                                <div className="text-center">
                                    <Button variant="light" onClick={() => setRecoveryMode("TOTP")}>Set up an
                                        app</Button>
                                </div>
                                <p><small>We suggest using an application such as <a rel="noopener noreferrer"
                                                                                     href="https://authy.com/features/"
                                                                                     target="_blank">Authy</a></small>
                                </p>
                            </Col>
                        </IfFeature>
                    </Row>
                </Else>
            </If>
        </div>
    );
}

export interface ITwoFactorAuthenticationProps {

}