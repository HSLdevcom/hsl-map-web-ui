import React from "react";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import Home from "components/home";
import Map from "components/map";
import style from "./app.css";

const rootPath = process.env.ROOT_PATH;

const App = () => (
    <div className={style.root}>
        <Router history={browserHistory}>
            <Route path={rootPath}>
                <IndexRoute component={Home} rootPath={rootPath}/>
                <Route path=":id" component={Map} rootPath={rootPath}/>
            </Route>
        </Router>
    </div>
);

export default App;
