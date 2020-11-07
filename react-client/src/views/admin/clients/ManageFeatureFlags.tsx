import React, {useState} from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import {FeatureFlagApi, IFeatureObject, IFeatureStatus} from "../../../api/v1/FeatureFlagApi";
import Icon from "../../../components/Icon";
import {useGlobalState} from "../../../state/GlobalState";

export default function ManageFeatureFlags(props: IManageFeatureFlagsProps) {
    const [globalFlags, setGlobalFlags] = useState(new Map<string, IFeatureObject>());
    const [clientFlags, setClientFlags] = useState(new Map<string, IFeatureStatus>());
    const [cards, setCards] = useState<JSX.Element[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [, dispatch] = useGlobalState();

    function refresh() {
        FeatureFlagApi.getEnabledFeatures()
            .then(data => {
                dispatch({
                    type: "setFeatures",
                    features: data
                });
            })
        FeatureFlagApi.get(props.clientId)
            .then((value) => {
                setGlobalFlags(value.global);
                setClientFlags(value.client);
                setCards([]);
                setLoaded(true);
            });
    }

    function save() {
        FeatureFlagApi.set(props.clientId, clientFlags)
            .then(response => {
                refresh();
            });
    }

    function forceDisable(featureKey: string): boolean {
        const globalDisabled = !globalFlags.get(featureKey)?.status.enabled ?? true;
        const forced = globalFlags.get(featureKey)?.status.force ?? true;
        return globalDisabled && forced;
    }

    function defer(featureKey: string): boolean {
        let clientFeature = clientFlags.get(featureKey);
        if (clientFeature) {
            return clientFeature.enabled === null;
        } else {
            return true;
        }
    }

    function setUseDefault(featureKey: string, value: boolean) {
        let clientFlag = clientFlags.get(featureKey);
        let globalFlag = globalFlags.get(featureKey)!!;

        if (clientFlag === null || clientFlag === undefined) {
            clientFlag = {
                enabled: globalFlag.status.enabled,
                force: globalFlag.status.force
            }
            clientFlags.set(featureKey, clientFlag);
        } else {
            clientFlag.enabled = value ? null : globalFlag.status.enabled;
            clientFlags.set(featureKey, clientFlag);
        }

        setCards([]);
    }

    function setEnable(featureKey: string, value: boolean) {
        let clientFlag = clientFlags.get(featureKey);

        if (clientFlag === null || clientFlag === undefined) {
            clientFlag = {
                enabled: value,
                force: false
            }
            clientFlags.set(featureKey, clientFlag);
        } else {
            clientFlag.enabled = value;
            clientFlags.set(featureKey, clientFlag);
        }

        setCards([]);
    }

    function setForce(featureKey: string, value: boolean) {
        let clientFlag = clientFlags.get(featureKey);

        if (clientFlag === null || clientFlag === undefined) {
            clientFlag = {
                enabled: false,
                force: value
            }
            clientFlags.set(featureKey, clientFlag);
        } else {
            clientFlag.force = value;
            clientFlags.set(featureKey, clientFlag);
        }

        setCards([]);
    }

    if (globalFlags.size === 0) {
        refresh();
    }

    if (cards.length === 0 && loaded) {
        globalFlags.forEach((value, featureKey) => {
            const card = (
                <Card key={featureKey}>
                    <Card.Header className="font-weight-bold">{value.label ?? "Error"}</Card.Header>
                    <Card.Body>
                        {value.description ?? "Error"}
                    </Card.Body>
                    <Card.Footer>
                        <Form title={forceDisable(featureKey) ? "Feature has been force disabled." : ""}>
                            <Form.Check
                                value="true"
                                title={forceDisable(featureKey) ? "Feature has been force disabled." : ""}
                                defaultChecked={defer(featureKey)}
                                disabled={forceDisable(featureKey)}
                                onChange={(e) => setUseDefault(featureKey, e.target.checked)}
                                className="unselectable"
                                type="switch"
                                id={`${featureKey}-default`}
                                label="Use Default"
                            />
                            <Form.Check
                                value="true"
                                title={forceDisable(featureKey) ? "Feature has been force disabled." : ""}
                                checked={clientFlags.get(featureKey)?.enabled ?? (value.status.enabled ?? false)}
                                disabled={defer(featureKey) || forceDisable(featureKey)}
                                className={`unselectable ${(forceDisable(featureKey)) ? "invisible" : ""}`}
                                onChange={(e) => setEnable(featureKey, e.target.checked)}
                                type="switch"
                                id={`${featureKey}-enabled`}
                                label="Enabled"
                            />
                            <Form.Check
                                value="true"
                                title={forceDisable(featureKey) ? "Feature has been force disabled." : ""}
                                defaultChecked={clientFlags.get(featureKey)?.force ?? (value.status.force ?? false)}
                                disabled={forceDisable(featureKey)}
                                className={`unselectable ${(defer(featureKey) || forceDisable(featureKey)) ? "invisible" : ""}`}
                                onChange={(e) => setForce(featureKey, e.target.checked)}
                                type="switch"
                                label="Force"
                                id={`${featureKey}-force`}
                            />
                        </Form>
                    </Card.Footer>
                </Card>
            );

            cards.push(card);
        });
    }

    return (
        <div>
            <header className="mb-4">
                <h3 className="d-inline">
                    Manage Feature Flags
                    <Icon title="Save" className="ml-2 d-inline-block h2 align-top" href="#" onClick={save}>save</Icon>
                </h3>
            </header>
            <div className="grid-3">
                {cards}
            </div>
        </div>
    );
}

export interface IManageFeatureFlagsProps {
    clientId: number;
}