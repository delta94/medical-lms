//https://github.com/lukashala/react-simply/blob/master/tools/state/src/index.js
import React, {
    createContext,
    useReducer,
    useContext,
    Dispatch
} from "react";

export interface IGlobalState {
    user: any;
    features: string[] | null;
    client: any;
}

export const StateContext = createContext<any>({
    user: {},
    features: null,
    client: {}
});

export const StateProvider = ({reducer, initialState, children}: IStateProviderProps) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
);

interface IStateProviderProps {
    reducer: any;
    initialState: IGlobalState;
    children: any;
}

export const useGlobalState = (): [IGlobalState, Dispatch<any>] => useContext(StateContext) as [IGlobalState, Dispatch<any>];