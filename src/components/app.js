import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "mobx-react";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import Home from "./home";
import MapContainer from "./mapContainer";
import style from "./app.module.css";
import LineStore from "../stores/lineStore";

const client = new ApolloClient({
  link: new HttpLink({ uri: process.env.REACT_APP_GRAPHQL_URL }),
  cache: new InMemoryCache(),
});

const rootPath = process.env.REACT_APP_ROOT_PATH;
const stores = {
  lineStore: LineStore,
};

const App = () => (
  <div className={style.root}>
    <Provider {...stores}>
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
          <MuiThemeProvider>
            <Router basename={rootPath}>
              <Route component={Home} path="/" exact />
              <Route path={"/map"} component={MapContainer} />
            </Router>
          </MuiThemeProvider>
        </ApolloHooksProvider>
      </ApolloProvider>
    </Provider>
  </div>
);

export default App;
