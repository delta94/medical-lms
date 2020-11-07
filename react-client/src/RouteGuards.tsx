import {useGlobalState} from "./state/GlobalState";
import React from "react";
import {Route, Redirect} from "react-router-dom";
import {Role} from "./api/v1/UserApi";
import {FeatureFlagApi} from "./api/v1/FeatureFlagApi";
import {AccountApi} from "./api/v1/AccountApi";

export function PrivateRoute(props) {
    return RoleProtectedRoute(props, Role.Standard);
}

const loginRedirect = <Redirect to="/account/login"/>;

function RoleProtectedRoute({component: Component, ...rest}, role: Role) {
    const [globalState, dispatch] = useGlobalState();
    if (globalState.user.email) {
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
                .then(client => {
                    dispatch({
                        type: "setClient",
                        newClient: client
                    })
                });
        }

        if (globalState.user.role >= role) {
            return <Route {...rest} render={(props) => (
                <div>
                    {/*Important the order of the props below matter*/}
                    <Component clientId={globalState.user.clientId} {...props.match.params} />
                </div>
            )}/>
        } else {
            return loginRedirect;
        }
    } else {
        const encodedToken = window.localStorage.getItem("token");
        if (encodedToken) {
            let decodedToken = JSON.parse(atob(encodedToken.split(".")[1]));
            let exp = decodedToken.exp;
            if (exp > new Date().getTime() / 1000 && decodedToken.email) {
                if (decodedToken.role >= role) {
                    dispatch({
                        type: "setUser",
                        newUser: decodedToken
                    });

                    FeatureFlagApi.getEnabledFeatures()
                        .then(data => {
                            dispatch({
                                type: "setFeatures",
                                features: data
                            });
                        });

                    AccountApi.getClient()
                        .then(client => {
                            dispatch({
                                type: "setClient",
                                newClient: client
                            })
                        });

                    return <Route {...rest} render={(props) => (
                        <div>
                            {/*Important the order of the props below matter*/}
                            <Component clientId={globalState.user.clientId} {...props.match.params} />
                        </div>
                    )}/>
                } else {
                    return loginRedirect;
                }
            } else {
                return loginRedirect;
            }
        } else {
            return loginRedirect;
        }
    }
}

export function SuperUserRoute(props) {
    return RoleProtectedRoute(props, Role.SuperUser);
}

export function AdminRoute(props) {
    return RoleProtectedRoute(props, Role.Admin);
}