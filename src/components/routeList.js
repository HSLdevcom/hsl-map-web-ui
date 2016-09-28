import React from "react";
import Route from "./route";
import RouteSearch from "./routeSearch";

const RouteList = ({ query, routes, updateQuery }) => {
    const renderRoutes = () =>
        routes.filter((value) => {
            if (value.lineId) {
                return value.lineNumber.startsWith(query);
            }
            return false;
        }).map(route => (
            <div>
                <Route
                  routeId={route.lineId}
                  longName={route.name_fi}
                  shortName={route.lineNumber}

                />
            </div>)
        );

    return (<div>
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
    updateQuery: React.PropTypes.func,
};

export default RouteList;
