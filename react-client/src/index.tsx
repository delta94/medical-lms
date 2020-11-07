import "./index.scss";
import React from "react";
import ReactDOM from "react-dom";
import "./i18n";
import './registerServiceWorker';

import {detect} from "detect-browser";
import App from "./App";

const browser = detect();

switch (browser && browser.name) {
    case "chrome":
    case "firefox":
    case "edge-chromium":
    case "chromium-webview":
    case "opera":
    case "android":
    case "ios":
    case "safari":
    case "ios-webview":
    case "searchbot":
    case "crios":
    case "fxios":
    case "edge": {
        ReactDOM.render(<App />, document.getElementById("root"));
        ReactDOM.render(<div />, document.getElementById("unsupported"));
        break;
    }
}

