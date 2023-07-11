import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "mobx-react";
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

import Home from "./home";
import MapContainer from "./mapContainer";
import ServerMessage from "./serverMessage";
import ErrorPage from "./errorPage";
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }
    return this.props.children;
  }
}

const App = () => (
  <div className={style.root}>
    <ServerMessage />
    <Provider {...stores}>
      <ApolloProvider client={client}>
        <ErrorBoundary>
          <Router basename={rootPath}>
            <Route component={Home} path="/" exact />
            <Route path={"/map"} component={MapContainer} />
          </Router>
        </ErrorBoundary>
      </ApolloProvider>
    </Provider>
  </div>
);

export default App;
