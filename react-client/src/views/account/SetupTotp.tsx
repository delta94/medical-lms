import Container from "react-bootstrap/Container";
import React, {useState} from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {useTranslation} from "react-i18next";
import {Redirect} from "react-router-dom";
import {TotpApi, TotpSetup} from "../../api/v1/MfaApi";
import Alert from "react-bootstrap/Alert";

export function SetupTotp(props: ISetupTotpProps) {
    const [error, setError] = useState("");
    const [totpSetup, setTotpSetup] = useState<TotpSetup | null>(null);
    const [code, setCode] = useState<number | null>(null);
    const [redirect, setRedirect] = useState(false);

    const {t} = useTranslation();

    if (redirect) {
        return <Redirect to="/account"/>;
    }

    if (!totpSetup) {
        TotpApi.getTotpSetup()
            .then(data => setTotpSetup(data));
    }

    function verifyTotpSetup() {
        if (code) {
            setError("");
            TotpApi.verifyTotpSetup(code)
                .then(data => {
                    if (data.success) {
                        setTimeout(() => {
                            setRedirect(true);
                        }, 300);
                    } else {
                        if (data.secretMissing || data.alreadySetup) {
                            setError("An error has occurred please try again later.");
                        } else {
                            setError("Invalid verification code");
                        }
                    }
                })
                .catch(error => {
                    if (error.statusCode === 401) {
                        setError(t("invalid-code"));
                    } else {
                        setError(t("server-error"));
                    }
                });
        }
    }

    return (
        <Container>
            <Card>
                <Card.Header>
                    <h2>{props.showStep ? "2. " : ""}Scan this barcode with your app.</h2>
                    <h5>Scan the image below with the two-factor authentication app on your phone.</h5>
                </Card.Header>
                <Card.Body>
                    <div className="text-center mt-5">
                        <img alt={totpSetup?.manualSetupKey} width={256} src={totpSetup?.qrCodeImage}/>
                        <div className="mt-5">
                            <p>If you can't scan the QR code: {totpSetup?.manualSetupKey}</p>
                        </div>
                    </div>
                    <div className="mt-5">
                        <h4>Enter the six-digit code that your app displays.</h4>
                        <input className="form-control w-25" type="number" placeholder="123456" value={code ?? ""} onChange={e => {
                            setError("");
                            setCode(+e.target.value);
                        }}/>
                    </div>
                    <Alert variant="danger" show={error !== ""}>{error}</Alert>
                </Card.Body>
                <Card.Footer>
                    <Button disabled={!code} onClick={verifyTotpSetup}>{t("verify")}</Button>
                </Card.Footer>
            </Card>
        </Container>
    );
}

export interface ISetupTotpProps {
    showStep: boolean;
}