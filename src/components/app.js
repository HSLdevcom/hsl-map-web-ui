import React from "react";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import Home from "components/home";
import Map from "components/map";
import style from "./app.css";

const App = () => (
    <div className={style.root}>
        <Router history={browserHistory}>
            <Route path="/kuljettaja">
                <IndexRoute component={Home}/>
                <Route path=":id" component={Map}/>
            </Route>
        </Router>
    </div>
);

export default App;
