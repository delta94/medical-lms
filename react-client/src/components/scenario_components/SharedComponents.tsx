import React from "react";
import If from "../If";
import {Table} from "react-bootstrap";

export default function SceneTextbox(props: { text: string }) {
    return (
        <div style={{width: "80%", height: 120}}>
            <p>{props.text}</p>
        </div>
    );
}

export function SceneHeader(props: { text: string }) {
    return (
        <div style={{width: "80%", display: "inline-block", minHeight: "35px"}}>
            <h3>{props.text}</h3>
        </div>
    );
}

export function SceneKeyValueView(props: IKeyValueViewProps) {
    return (
        <div>
            <Table bordered>
                <tbody>
                <If conditional={props.header !== undefined}>
                    <tr>
                        <th>{props.header?.key}</th>
                        <th>{props.header?.value}</th>
                    </tr>
                </If>
                {props.data.map((pair, index) => {
                    return (
                        <tr key={index}>
                            <td>{pair.key}</td>
                            <td>{pair.value}</td>
                        </tr>
                    )
                })}
                </tbody>
            </Table>
        </div>
    );

}


export interface IKeyValueViewProps {
    header?: KeyValuePair<string, string>;
    data: Array<KeyValuePair<string|JSX.Element, string>>;
}

export interface KeyValuePair<T1, T2> {
    key: T1;
    value: T2;
}