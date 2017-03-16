import React from "react";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { ApolloClient, createNetworkInterface, ApolloProvider } from "react-apollo";
import Home from "components/home";
import MapContainer from "components/mapContainer";
import style from "./app.css";

const client = new ApolloClient({
    networkInterface: createNetworkInterface({
        uri: "http://kartat.hsl.fi/jore/graphql",
    }),
});

const rootPath = process.env.ROOT_PATH;

const App = () => (
    <div className={style.root}>
        <ApolloProvider client={client}>
            <Router history={browserHistory}>
                <Route path={rootPath}>
                    <IndexRoute component={Home} rootPath={rootPath}/>
                    <Route
                      path=":id/:dateBegin/:dateEnd"
                      component={MapContainer}
                      rootPath={rootPath}
                    />
                </Route>
            </Router>
        </ApolloProvider>
    </div>
);

export default App;
