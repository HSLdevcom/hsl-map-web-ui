import React from "react";
import { render } from "react-dom";

import App from "./components/app";
import "./styles/base.css";

const root = document.body.appendChild(document.createElement("div"));

render(<App />, root);
