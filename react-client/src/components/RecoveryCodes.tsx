import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Icon from "./Icon";
import Button from "react-bootstrap/Button";
import {useTranslation} from "react-i18next";

export function RecoveryCodes(props: IRecoveryCodesProps) {
    const {t} = useTranslation();

    async function saveToClipboard() {
        let text = "";
        props.value.forEach(code => {
            text += code;
            text += "\n";
        });

        await navigator.clipboard.writeText(text);
    }

    function recoveryCodesFile(): string {
        let text = "";
        props.value.forEach(code => {
            text += code;
            text += "\n";
        });
        return text;
    }

    return (
        <div>
            <Row>
                <Col>
                    <ul>
                        {props.value.slice(0, 5).map((c, index) => {
                            return (<li key={index}>
                                <h3 className="font-weight-bold">{c}</h3>
                            </li>);
                        })}
                    </ul>
                </Col>
                <Col>
                    <ul>
                        {props.value.slice(5, 10).map((c, index) => {
                            return (<li key={index}>
                                <h3 className="font-weight-bold">{c}</h3>
                            </li>);
                        })}
                    </ul>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="float-right">
                        <a className="btn btn-primary"
                           href={`data:text;charset=utf-8,${encodeURI(recoveryCodesFile())}`}
                           download="recovery-codes.txt"><Icon>get_app</Icon> {t("download")}</a>
                    </div>
                </Col>
                <Col>
                    <div className="float-left">
                        <Button onClick={async () => await saveToClipboard()}><Icon>assignment</Icon> {t("copy")}
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export interface IRecoveryCodesProps {
    value: string[]
}