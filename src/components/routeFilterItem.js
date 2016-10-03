import React from "react";

const parseRouteNumber = routeId =>
    // Remove 1st number, which represents the city
    // Remove all zeros from the beginning
    routeId.substring(1).replace(/^0+/, "");

const RouteFilterItem = ({ routeID, routeDirection, isChecked, onChange }) =>
    (<div>
        <input
          type="checkbox"
          value={routeID + "_" + routeDirection}
          checked={isChecked}
          onChange={onChange}
        />
        <span>{parseRouteNumber(routeID)} {routeDirection === 2 ? "Paluu" : "Meno"}</span>
    </div>);

RouteFilterItem.propTypes = {
    routeID: React.PropTypes.string,
};

export default RouteFilterItem;
