import React, {useState} from "react";
import {MfaApi} from "../../../api/v1/MfaApi";
import Icon from "../../../components/Icon";
import Button from "react-bootstrap/Button";
import {RecoveryCodes} from "../../../components/RecoveryCodes";

export function RecoveryCodesManagement() {
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

    function regenerate() {
        MfaApi.generateRecoveryCodes(true)
            .then(() => {
                refresh();
            });
    }

    function refresh() {
        MfaApi.findRecoveryCodes()
            .then(data => setRecoveryCodes(data));
    }

    if (recoveryCodes.length === 0) {
        refresh();
    }

    return (
        <div>
            <h4>Recovery codes <Button className="float-right" onClick={regenerate}><Icon>autorenew</Icon> Regenerate</Button></h4>
            <RecoveryCodes value={recoveryCodes}/>
        </div>
    );
}