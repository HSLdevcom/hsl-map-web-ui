import React from "react";
import LineAlert from "./lineAlert";
import LineIcon from "./lineIcon";
import styles from "./lineAlertList.module.css";

const LineAlertList = (props) => {
  console.log(props);
  return (
    <div className={styles.alertListContainer}>
      <LineIcon
        transportType={props.line.transportType}
        shortName={props.line.lineNumber}
        lineNameFi={props.line.lineNameFi}
        iconSize="24"
        additionalStyle={{ marginBottom: "15px" }}
      />
      <div>
        {props.alerts.map((alert) => {
          return <LineAlert key={alert.id} alert={alert} />;
        })}
      </div>
    </div>
  );
};

export default LineAlertList;
