import React from "react";
import { Router, Route, browserHistory } from "react-router";

import Header from "components/header";
import Home from "components/home";
import Map from "components/map";

const App = () => (
    <div>
        <Header/>
        <Router history={browserHistory}>
            <Route path="/" component={Home}/>
            <Route path=":id" component={Map}/>
        </Router>
    </div>
);

export default App;
