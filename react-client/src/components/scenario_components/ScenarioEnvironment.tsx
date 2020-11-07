import React from "react";
import {Environment} from "../../api/v1/ScenarioEnvironmentApi";

export default function ScenarioEnvironment(props: IScenarioEnvironmentProps) {
    return (
        <div className="fullscreen-content">
            <div style={{
                backgroundImage: `url(${props.environment.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%", height: "calc(100vh - 72px)", paddingTop: "50px"
            }}>
                <div className="container">
                    <div style={{backgroundColor: "#FFFFFFC0", padding: "30px", borderRadius: "15px"}}>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );

}

export interface IScenarioEnvironmentProps {
    environment: Environment;
    children?: React.ReactNode;
}
