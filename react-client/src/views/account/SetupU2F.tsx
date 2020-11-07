import Container from "react-bootstrap/Container";
import React, {useState} from "react";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {useTranslation} from "react-i18next";
import {Fido} from "../../api/v1/FidoApi";
import {Redirect} from "react-router-dom";

export function SetupU2F() {
    const [identifier, setIdentifier] = useState("");
    const [redirect, setRedirect] = useState(false);

    const {t} = useTranslation();

    async function register() {
        await Fido.registerAuthenticator(identifier)
            .then(_ => {
                setTimeout(() => {
                    setRedirect(true);
                }, 300);
            })
            .catch(_ => {
                //TODO handle this
            });
    }

    if (redirect) {
        return <Redirect to="/account" />;
    }

    return (
        <Container>
            <Card>
                <Card.Header>
                    <h2>2. Setup a U2F Authenticator</h2>
                </Card.Header>
                <Card.Body>
                    <InputGroup>
                        <FormControl type="text" placeholder="Enter a name" value={identifier} onChange={e => setIdentifier(e.target.value)} />
                        <InputGroup.Append>
                            <Button variant="primary" onClick={async () => await register}>{t("add")}</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Card.Body>
            </Card>
        </Container>
    );
}