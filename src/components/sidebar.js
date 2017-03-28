import React from "react";
import RouteFilter from "./routeFilter";
import LineIcon from "./lineIcon";
import Header from "./header";
import styles from "./sidebar.css";

const Sidebar = props => (
    <div className={styles.root}>
        <Header rootPath={props.rootPath}/>
        <div className={styles.elementContainer}>
            <LineIcon
              transportType={props.transportType}
              shortName={props.lineNumber}
              lineNameFi={props.lineNameFi}
              iconSize="24"
              additionalStyle={{ marginBottom: "15px" }}
            />
            <div id="map-container">
                <RouteFilter
                  transportType={props.transportType}
                  routes={props.routes}
                  selectedRoutes={props.selectedRoutes}
                  toggleChecked={props.toggleChecked}
                  isFullScreen={props.isFullScreen}
                  showFilter={props.showFilter}
                  toggleFilter={props.toggleFilter}
                />
            </div>
        </div>
    </div>
);

export default Sidebar;
