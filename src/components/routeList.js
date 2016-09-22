import React from "react";
import Route from "./route";
import RouteSearch from "./routeSearch";
import styles from "./routeList.css";

const RouteList = ({ query, routes, updateQuery }) => {
    const renderRoutes = () =>
        Object.entries(JSON.parse(routes)).filter((value) => {
            if (value[1].shortName) {
                return value[1].shortName.startsWith(query);
            }
            return false;
        }).map(route =>
            (<div>
                <Route
                  routeId={route[0]}
                  longName={(route[1] ? route[1].longName : "")}
                  shortName={(route[1] ? route[1].shortName : "")}

                />
            </div>)
        );

    return (<div className={styles.root}>
        <h1>Reitit</h1>
        <RouteSearch
          query={query}
          onChange={updateQuery}
        />
        {routes ? renderRoutes() : null}
    </div>);
};

RouteList.propTypes = {
    query: React.PropTypes.string,
    routes: React.PropTypes.string.isRequired,
    updateQuery: React.PropTypes.func,
};

export default RouteList;
