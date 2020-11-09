import React from "react";
import RouteFilter from "./routeFilter";
import LineIcon from "./lineIcon";
import Header from "./header";
import Notes from "./notes";
import styles from "./sidebar.module.css";

const Sidebar = (props) => {
  return (
    <div className={styles.root}>
      <Header />
      {props.lines.map((line, index) => {
        return (
          <div key={index} className={styles.elementContainer}>
            <LineIcon
              transportType={line.transportType}
              shortName={line.lineNumber}
              lineNameFi={line.lineNameFi}
              iconSize="24"
              additionalStyle={{ marginBottom: "15px" }}
            />
            <div id="map-container">
              <RouteFilter
                transportType={line.transportType}
                routes={line.routes}
                selectedRoutes={props.selectedRoutes}
                toggleChecked={props.toggleChecked}
                isFullScreen={props.isFullScreen}
                showFilter={props.showFilter}
                toggleFilter={props.toggleFilter}
                setMapCenter={props.setMapCenter}
              />
            </div>
            <Notes notes={line.notes} />
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
