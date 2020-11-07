import React from "react";
import {IGlobalState, StateProvider} from "state/GlobalState";
import {emptyUser} from "./api/v1/UserApi";
import {emptyClient} from "./api/v1/ClientApi";
import Main from "./Main";

export default function App() {
    const initialState: IGlobalState = {
        user: emptyUser(),
        features: null,
        client: emptyClient()
    };

    function reducer(state, action) {
        if (action.type === "setUser") {
            return {
                ...state,
                user: action.newUser
            }
        } else if (action.type === "setClient") {
            return {
                ...state,
                client: action.newClient
            }
        } else if (action.type === "setFeatures") {
            return {
                ...state,
                features: action.features
            }
        } else {
            return state;
        }
    }

    return (
        <StateProvider initialState={initialState} reducer={reducer}>
            <Main/>
        </StateProvider>
    );
}
