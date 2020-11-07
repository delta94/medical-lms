import React from "react";
import ChangePassword from "./fragments/ChangePassword";
import {TwoFactorAuthentication} from "./fragments/TwoFactorAuthentication";
import {IfFeature} from "../../components/IfFeature";
import {Else, Then} from "../../components/If";

export default function Security() {
    return (
        <div>
            <ChangePassword />
            <IfFeature feature="mfa">
                <IfFeature feature="mfa-totp" hasElse={true}>
                    <Then>
                        <hr />
                        <TwoFactorAuthentication />
                    </Then>
                    <Else>
                        <IfFeature feature="mfa-fido">
                            <Then>
                                <hr />
                                <TwoFactorAuthentication />
                            </Then>
                        </IfFeature>
                    </Else>
                </IfFeature>
                <Then>
                </Then>
            </IfFeature>
        </div>
    );
}