import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import Home from "./home";
import MapContainer from "./mapContainer";
import style from "./app.module.css";

const client = new ApolloClient({
  link: new HttpLink({ uri: process.env.REACT_APP_GRAPHQL_URL }),
  cache: new InMemoryCache(),
});

const rootPath = process.env.REACT_APP_ROOT_PATH;

const App = () => (
  <div className={style.root}>
    <ApolloProvider client={client}>
      <Router basename={rootPath}>
        <Route component={Home} path="/" exact />
        <Route path="/map/:id/:dateBegin/:dateEnd" component={MapContainer} />
      </Router>
    </ApolloProvider>
  </div>
);

export default App;
