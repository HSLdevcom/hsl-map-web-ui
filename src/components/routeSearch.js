import React from "react";
import styles from "./routeSearch.css";

const RouteSearch = ({ query, onChange }) =>
    (<div className={styles.root}>
        <form name="routeSearch">
            <input
              type="text"
              placeholder="Hae reitti"
              value={query}
              onChange={onChange}
            />
        </form>
    </div>);

RouteSearch.propTypes = {
    query: React.PropTypes.string,
    onChange: React.PropTypes.func,
};

export default RouteSearch;

