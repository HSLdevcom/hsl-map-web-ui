import React from "react";
import LineAlert from "./lineAlert";

const LineAlertList = (props) => {
  return (
    <div>
      <h2>{props.alerts[0]["route_id"]}</h2>
      <ul>
        {props.alerts.map((alert) => {
          return <LineAlert key={alert.id} alert={alert} />;
        })}
      </ul>
    </div>
  );
};

export default LineAlertList;
